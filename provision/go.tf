resource "google_compute_instance_template" "tpl" {
  name = "tfinstance-tpl"
  machine_type = "${var.vm_type["512gig"]}"

  disk {
    source_image = "debian-cloud/debian-9"
    auto_delete = true
    disk_size_gb = 100
    boot = true
  }

  network_interface {
    network = "default"
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
  name           = "instance-template-1a"
  zone = "${var.region}"

  source_instance_template = "${google_compute_instance_template.tpl.self_link}"

  scheduling{
    automatic_restart = false
  }
  // Override fields from instance template
  can_ip_forward = false
  labels = {
    my_key       = "my_value"
  }
}