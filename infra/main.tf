terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=4.22.0"
    }
  }
  cloud {
    organization = "feketesamu"
    workspaces {
      name = "pontozo-mtfsz"
    }
  }
}

provider "azurerm" {
  features {}
  resource_provider_registrations = "core"
  resource_providers_to_register = [
    "Microsoft.ApiManagement",
    "Microsoft.Cache",
    "Microsoft.Communication",
    "Microsoft.EventGrid",
    "Microsoft.Sql",
    "Microsoft.Storage",
    "Microsoft.Web"
  ]
}

resource "azurerm_resource_group" "pontozo-rg" {
  name     = "pontozo-next"
  location = "Poland Central"
}
