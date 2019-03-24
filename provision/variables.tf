variable "region" {
  default = "europe-west2-c"
}

variable "project-name" {
  default = "numeric-scope-199723"
}

variable "subnetwork-region" {
  default = "europe-west2"
}

variable "network" {
  default = "ovirt-network"
}

variable "vm_type" {
  default {
    "512gig"     = "f1-micro"
  }
}

variable "os" {
  default {
    "ubuntu-1604-lts" = "ubuntu-1604-xenial-v20190306"
  }
}