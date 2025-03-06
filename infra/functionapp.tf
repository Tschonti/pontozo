variable "FA_ADMINS" {
  type      = string
  sensitive = true
}

variable "FA_FUNCTIONS_URL" {
  type = string
}

// TODO remove
variable "ACS_CONNECTION_STRING" {
  type      = string
  sensitive = true
}

variable "DB_PWD" {
  type      = string
  sensitive = true
}

variable "DB_USER" {
  type      = string
  sensitive = true
}

variable "FA_JWT_SECRET" {
  type      = string
  sensitive = true
}

variable "DB_ADMIN_USER" {
  type      = string
  sensitive = true
}

locals {
  function_app_name = "pontozoapi"
}

resource "azurerm_service_plan" "sp" {
  name                = "pontozo-sp"
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  location            = azurerm_resource_group.pontozo-rg.location
  os_type             = "Windows"
  sku_name            = "Y1"
}

resource "azurerm_windows_function_app" "function-app" {
  name                = local.function_app_name
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  location            = azurerm_resource_group.pontozo-rg.location

  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key
  service_plan_id            = azurerm_service_plan.sp.id


  site_config {
    application_insights_key               = azurerm_application_insights.appinsights.instrumentation_key
    application_insights_connection_string = azurerm_application_insights.appinsights.connection_string

    application_stack {
      node_version = "~20"
    }

    cors {
      allowed_origins = ["https://pontozo.mtfsz.hu", format("%s%s", "https://", azurerm_static_web_app.swa.default_host_name)]
    }
  }

  app_settings = {
    "ACS_CONNECTION_STRING"    = var.ACS_CONNECTION_STRING // TODO get dynamically from terraform instance
    "ADMINS"                   = var.FA_ADMINS
    "APIM_HOST"                = azurerm_api_management.apim.gateway_url
    "APIM_KEY"                 = azurerm_api_management_subscription.backend-sub.primary_key
    "CLIENT_ID"                = var.MTFSZ_CLIENT_ID
    "CLIENT_SECRET"            = var.MTFSZ_CLIENT_SECRET
    "DB_NAME"                  = azurerm_mssql_database.sqldatabase.name
    "DB_PWD"                   = var.DB_PWD
    "DB_ADMIN_PWD"             = var.DB_ADMIN_PWD
    "DB_ADMIN_USER"            = var.DB_ADMIN_USER
    "DB_SERVER"                = azurerm_mssql_server.sqlserver.fully_qualified_domain_name
    "DB_USER"                  = var.DB_USER
    "ENCRYPT"                  = true
    "ENV"                      = "production"
    "FRONTEND_URL"             = "https://pontozo.mtfsz.hu"
    "FUNCTION_HOST"            = format("https://%s.azurewebsites.net", local.function_app_name)
    "MTFSZ_API_HOST"           = var.MTFSZ_API_HOST
    "FUNCTIONS_WORKER_RUNTIME" = "node"
    "JWT_SECRET"               = var.FA_JWT_SECRET
    "REDIS_HOST"               = azurerm_redis_cache.redis-cache.hostname
    "REDIS_PORT"               = azurerm_redis_cache.redis-cache.ssl_port
    "REDIS_PWD"                = azurerm_redis_cache.redis-cache.primary_access_key
    "WEBSITE_RUN_FROM_PACKAGE" = 1
    "WEBSITE_TIME_ZONE"        = "Central Europe Standard Time"
  }
}
