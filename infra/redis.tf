resource "azurerm_redis_cache" "redis-cache" {
  name                 = "pontozo-cache"
  location             = azurerm_resource_group.pontozo-rg.location
  resource_group_name  = azurerm_resource_group.pontozo-rg.name
  capacity             = 0
  family               = "C"
  sku_name             = "Basic"
  non_ssl_port_enabled = false
  minimum_tls_version  = "1.2"
}
