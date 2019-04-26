provider "google" {
  credentials = "${file("${path.module}/.secrets.json")}"
  project     = "${var.project-name}"
  region      = "${var.region}"
}