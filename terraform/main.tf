terraform {
  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }
}

provider "azurerm" {
  features {}
  subscription_id = "ca753a19-5893-402b-9913-618a3af09d86"
}

resource "azurerm_resource_group" "rg" {
  name     = "fitness-tracker-rg"
  location = "eastus2"
}

resource "azurerm_mssql_server" "sql" {
  name                         = "fitness-sql-001"
  resource_group_name          = azurerm_resource_group.rg.name
  location                     = azurerm_resource_group.rg.location
  version                      = "12.0"
  administrator_login          = "sqladmin"
  administrator_login_password = "Testmdp1!"
  depends_on                   = [azurerm_resource_group.rg]
}

resource "azurerm_mssql_database" "db" {
  name         = "fitness-tracker-db"
  server_id    = azurerm_mssql_server.sql.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  license_type = "LicenseIncluded"
  max_size_gb  = 2
  sku_name     = "Basic"
  depends_on   = [azurerm_mssql_server.sql]
}


resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

resource "azurerm_service_plan" "plan" {
  name                = "fitness-plan-001"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "api" {
  name                = "fitness-api-001"
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  service_plan_id     = azurerm_service_plan.plan.id

  site_config {
    application_stack {
      python_version = "3.10"
    }
  }
}

# resource "azurerm_static_web_app" "frontend" {
#   name                = "fitness-app-frontend-001"
#   resource_group_name = azurerm_resource_group.rg.name
#   location            = azurerm_resource_group.rg.location
#   depends_on          = [azurerm_mssql_database.db] # Wait for DB to be ready
# }
