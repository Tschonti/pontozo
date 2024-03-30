resource "azurerm_application_insights" "appinsights" {
  name                = "pontozo-insights-tf"
  location            = azurerm_resource_group.tf-rg.location
  resource_group_name = azurerm_resource_group.tf-rg.name
  application_type    = "web"
}

output "appinsights_connection_string" {
  value = azurerm_application_insights.appinsights.connection_string
}

output "app_id" {
  value = azurerm_application_insights.appinsights.app_id
}
