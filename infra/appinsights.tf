resource "azurerm_log_analytics_workspace" "law" {
  name                = "pontozo-law"
  location            = azurerm_resource_group.pontozo-rg.location
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = "pontozo-insights"
  location            = azurerm_resource_group.pontozo-rg.location
  resource_group_name = azurerm_resource_group.pontozo-rg.name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}
