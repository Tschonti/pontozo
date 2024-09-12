resource "azurerm_static_web_app" "swa" {
  name                = "pontozo-fe"
  location            = "West Europe"
  resource_group_name = azurerm_resource_group.pontozo-rg.name
}

output "swa_api_key" {
  value     = azurerm_static_web_app.swa.api_key
  sensitive = true
}
