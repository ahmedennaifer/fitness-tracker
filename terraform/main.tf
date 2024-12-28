terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.70.0"
    }
  }
}

provider "azurerm" {
  skip_provider_registration = true
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

resource "azurerm_resource_group" "rg" {
  name     = "fitness-tracker-rg-2"
  location = "North Europe"
}

resource "azurerm_mssql_server" "sql" {
  name                         = "fitness-sql-001"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = "North Europe"
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = "Testmdp1!"

  depends_on = [azurerm_resource_group.rg]

  lifecycle {
    ignore_changes = [
      connection_policy
    ]
  }
}

resource "azurerm_mssql_database" "db" {
  name         = "fitness-tracker-db-2"
  server_id    = azurerm_mssql_server.sql.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  license_type = "LicenseIncluded"
  max_size_gb  = 2
  sku_name     = "Basic"

  depends_on = [azurerm_mssql_server.sql]
}

resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}


resource "azurerm_service_plan" "plan" {
  name                = "fitness-plan-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "api" {
  name                = "fitness-api-backed-001-ahmed2"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false
    application_stack {
      python_version = "3.10"
    }
  }
}


resource "azurerm_key_vault" "kv" {
  name                = "fitness-ml-kv-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"
}

resource "azurerm_key_vault_access_policy" "ml" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  key_permissions = [
    "Get", "List", "Create"
  ]

  secret_permissions = [
    "Get", "List", "Set"
  ]
}


data "azurerm_client_config" "current" {}

resource "azurerm_machine_learning_workspace" "ml" {
  name                    = "fitness-ml-workspace"
  location                = azurerm_resource_group.rg.location
  resource_group_name     = azurerm_resource_group.rg.name
  application_insights_id = azurerm_application_insights.appinsights.id
  key_vault_id            = azurerm_key_vault.kv.id
  storage_account_id      = azurerm_storage_account.storage.id

  public_network_access_enabled = true # public access

  identity {
    type = "SystemAssigned"
  }
}



resource "azurerm_application_insights" "appinsights" {
  name                = "fitness-insights-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_storage_account" "storage" {
  name                     = "fitnessmlstore001"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_monitor_action_group" "main" {
  name                = "fitness-alert-group"
  resource_group_name = azurerm_resource_group.rg.name
  short_name          = "fitnessag"
}

resource "azurerm_monitor_metric_alert" "api_response" {
  name                = "api-response-time-alert"
  resource_group_name = azurerm_resource_group.rg.name
  scopes              = [azurerm_linux_web_app.api.id]
  description         = "Alert when API response time is too high"

  criteria {
    metric_namespace = "Microsoft.Web/sites"
    metric_name      = "HttpResponseTime"
    aggregation      = "Average"
    operator         = "GreaterThan"
    threshold        = 5
  }

  action {
    action_group_id = azurerm_monitor_action_group.main.id
  }
}

output "app_insights_key" {
  value     = azurerm_application_insights.appinsights.instrumentation_key
  sensitive = true
}

output "app_insights_connection_string" {
  value     = azurerm_application_insights.appinsights.connection_string
  sensitive = true
}

output "storage_account_name" {
  value = azurerm_storage_account.storage.name
}
