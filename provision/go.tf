resource "random_id" "instance_id" {
  byte_length = 8
}

resource "google_compute_instance_template" "tpl" {
  name = "tpl-${random_id.instance_id.hex}"
  machine_type = "${var.vm_type["512gig"]}"
  labels = {
    environment = "dev"
  }

  disk {
    source_image = "ubuntu-os-cloud/ubuntu-1604-xenial-v20190325"
    auto_delete = true
    disk_size_gb = 10
    boot = true
  }

  network_interface {
    network = "${var.network}"
    access_config {
      // Include this section to give the VM an external ip address
    }
  }
  scheduling {
    preemptible       = true
    automatic_restart = false
  }

  metadata = {
    foo = "bar"
  }
  can_ip_forward = true
}

resource "google_compute_instance_from_template" "tpl" {
  name           = "success-instance-${random_id.instance_id.hex}"
  zone = "${var.region}"

  source_instance_template = "${google_compute_instance_template.tpl.self_link}"

  scheduling{
    preemptible       = true
    automatic_restart = false
  }
  // Override fields from instance template
  can_ip_forward = false
  labels = {
    my_key       = "my_value"
  }
  tags = ["http-server","https-server"]

  network_interface {
    subnetwork = "${var.network}"

    access_config {
      // Ephemeral IP
    }
  }
}

output "ip" {
  value = "${google_compute_instance_from_template.tpl.network_interface.0.access_config.0.nat_ip}"
}