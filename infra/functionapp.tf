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
}
