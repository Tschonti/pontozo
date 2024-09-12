resource "azurerm_static_web_app" "swa" {
  name                = "pontozo-fe"
  location            = "West Europe"
  resource_group_name = azurerm_resource_group.pontozo-rg.name
}

resource "azurerm_dns_cname_record" "pontozo-dns-record" {
  name                = "pontozo"
  zone_name           = "mtfsz.hu"
  resource_group_name = azurerm_resource_group.pontozo-rg
  ttl                 = 300
  record              = azurerm_static_web_app.swa.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "pontozo-fe-domain" {
  static_web_app_id = azurerm_static_web_app.swa.id
  domain_name       = "${azurerm_dns_cname_record.pontozo-dns-record.name}.${azurerm_dns_cname_record.pontozo-dns-record.zone_name}"
  validation_type   = "cname-delegation"
}

output "swa_api_key" {
  value     = azurerm_static_web_app.swa.api_key
  sensitive = true
}
