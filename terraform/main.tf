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

data "azurerm_client_config" "current" {}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.location
}

resource "azurerm_mssql_server" "sql" {
  name                         = var.sql_server_name
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = var.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password

  depends_on = [azurerm_resource_group.rg]

  lifecycle {
    ignore_changes = [
      connection_policy
    ]
  }
}

resource "azurerm_mssql_database" "db" {
  name         = var.database_name
  server_id    = azurerm_mssql_server.sql.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  license_type = "LicenseIncluded"
  max_size_gb  = 2
  sku_name     = "Basic"
}

resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

resource "azurerm_service_plan" "plan" {
  name                = var.app_service_plan_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "F1"
}

resource "azurerm_linux_web_app" "api" {
  name                = var.web_app_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = var.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    always_on = false
    application_stack {
      python_version = "3.10"
    }
  }
}

resource "azurerm_key_vault" "kv" {
  name                = var.key_vault_name
  location            = var.location
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

resource "azurerm_application_insights" "appinsights" {
  name                = var.app_insights_name
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"
}

resource "azurerm_storage_account" "storage" {
  name                     = var.storage_account_name
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = var.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
}

resource "azurerm_machine_learning_workspace" "ml" {
  name                          = var.ml_workspace_name
  location                      = var.location
  resource_group_name           = azurerm_resource_group.rg.name
  application_insights_id       = azurerm_application_insights.appinsights.id
  key_vault_id                  = azurerm_key_vault.kv.id
  storage_account_id            = azurerm_storage_account.storage.id
  public_network_access_enabled = true

  identity {
    type = "SystemAssigned"
  }
}

resource "azurerm_monitor_action_group" "main" {
  name                = var.action_group_name
  resource_group_name = azurerm_resource_group.rg.name
  short_name          = "fitnessag"
}

resource "azurerm_monitor_metric_alert" "api_response" {
  name                = var.alert_name
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

