variable "FA_ADMINS" {
  type      = string
  sensitive = true
}

variable "FA_FUNCTIONS_URL" {
  type = string
}

variable "DB_PWD" {
  type      = string
  sensitive = true
}

variable "FA_JWT_SECRET" {
  type      = string
  sensitive = true
}

resource "azurerm_service_plan" "sp" {
  name                = "pontozo-sp-tf"
  resource_group_name = azurerm_resource_group.tf-rg.name
  location            = azurerm_resource_group.tf-rg.location
  os_type             = "Windows"
  sku_name            = "Y1"
}

resource "azurerm_windows_function_app" "function-app" {
  name                = "pontozo-api-tf"
  resource_group_name = azurerm_resource_group.tf-rg.name
  location            = azurerm_resource_group.tf-rg.location

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  service_plan_id            = azurerm_service_plan.sp.id


  site_config {
    application_insights_key               = azurerm_application_insights.appinsights.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.appinsights.connection_string

    application_stack {
      node_version = "~18"
    }

    cors {
      allowed_origins = ["https://pontozo.mtfsz.hu"]
    }
  }

  app_settings = {
    "ADMINS"        = var.FA_ADMINS
    "APIM_HOST"     = azurerm_api_management.apim.gateway_url
    "APIM_KEY"      = ""
    "CLIENT_ID"     = var.MTFSZ_CLIENT_ID
    "CLIENT_SECRET" = var.MTFSZ_CLIENT_SECRET
    # "DB_ADMIN_PWD" = ""
    # "DB_ADMIN_USER" = ""
    "DB_NAME"                  = azurerm_mssql_database.sqldatabase.name
    "DB_PWD"                   = var.DB_PWD
    "DB_SERVER"                = azurerm_mssql_server.sqlserver.fully_qualified_domain_name
    "DB_USER"                  = var.DB_PWD
    "ENCRYPT"                  = true
    "FRONTEND_URL"             = "TODO"
    "FUNCTION_HOST"            = var.FA_FUNCTIONS_URL
    "FUNCTIONS_WORKER_RUNTIME" = "node"
    "JWT_SECRET"               = var.FA_JWT_SECRET
    "REDIS_HOST"               = "TODO"
    "REDIS_PORT"               = "TODO"
    "REDIS_PWD"                = "TODO"
    "WEBSITE_RUN_FROM_PACKAGE" = 1
    "WEBSITE_TIME_ZONE"        = "Central Europe Standard Time"
  }
}
