resource "azurerm_storage_account" "storage" {
  name                     = "pontozostorage"
  resource_group_name      = azurerm_resource_group.pontozo-rg.name
  location                 = azurerm_resource_group.pontozo-rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"
  account_kind             = "Storage"
}
