variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region for resources"
  type        = string
}

variable "sql_server_name" {
  description = "Name of the SQL Server"
  type        = string
}

variable "sql_admin_username" {
  description = "SQL Server admin username"
  type        = string
}

variable "sql_admin_password" {
  description = "SQL Server admin password"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "Name of the SQL database"
  type        = string
}

variable "app_service_plan_name" {
  description = "Name of the App Service Plan"
  type        = string
}

variable "web_app_name" {
  description = "Name of the Web App"
  type        = string
}

variable "key_vault_name" {
  description = "Name of the Key Vault"
  type        = string
}

variable "app_insights_name" {
  description = "Name of Application Insights"
  type        = string
}

variable "storage_account_name" {
  description = "Name of the Storage Account"
  type        = string
}

variable "ml_workspace_name" {
  description = "Name of the ML Workspace"
  type        = string
}

variable "action_group_name" {
  description = "Name of the Action Group"
  type        = string
}

variable "alert_name" {
  description = "Name of the Alert"
  type        = string
}
