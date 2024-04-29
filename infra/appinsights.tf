resource "azurerm_log_analytics_workspace" "law" {
  name                = "pontozo-law-tf"
  location            = azurerm_resource_group.tf-rg.location
  resource_group_name = azurerm_resource_group.tf-rg.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

resource "azurerm_application_insights" "appinsights" {
  name                = "pontozo-insights-tf"
  location            = azurerm_resource_group.tf-rg.location
  resource_group_name = azurerm_resource_group.tf-rg.name
  workspace_id        = azurerm_log_analytics_workspace.law.id
  application_type    = "web"
}
