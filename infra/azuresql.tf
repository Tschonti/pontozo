variable "DB_ADMIN_PWD" {
  type      = string
  sensitive = true
}

resource "azurerm_mssql_server" "sqlserver" {
  name                         = "pontozo-db-server-tf"
  resource_group_name          = azurerm_resource_group.tf-rg.name
  location                     = azurerm_resource_group.tf-rg.location
  version                      = "12.0"
  administrator_login          = "dbadmin"
  administrator_login_password = var.DB_ADMIN_PWD
  minimum_tls_version          = "1.2"

}

resource "azurerm_mssql_database" "sqldatabase" {
  name                 = "pontozo-dtu-db-tf"
  server_id            = azurerm_mssql_server.sqlserver.id
  collation            = "SQL_Latin1_General_CP1_CI_AS"
  license_type         = "LicenseIncluded"
  max_size_gb          = 250
  sku_name             = "S0"
  storage_account_type = "Local"

  lifecycle {
    prevent_destroy = true
  }
}

resource "azurerm_mssql_firewall_rule" "sqlserver_allow_azure" {
  name             = "AzureResources"
  server_id        = azurerm_mssql_server.sqlserver.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}
