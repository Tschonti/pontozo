terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=3.96.0"
    }
    azapi = {
      source = "azure/azapi"
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
}

resource "azurerm_resource_group" "pontozo-rg" {
  name     = "pontozo-next"
  location = "Poland Central"
}
