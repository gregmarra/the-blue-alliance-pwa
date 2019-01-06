workflow "Build and deploy" {
  on = "push"
  resolves = [
    "Deploy branch filter",
    "Setup Google Cloud",
    "Deploy",
  ]
}

action "Deploy branch filter" {
  uses = "actions/bin/filter@b2bea07"
  args = "branch master"
}

action "Install packages" {
  uses = "actions/npm@e7aaefe"
  args = "install"
  needs = ["Deploy branch filter"]
}

action "Build" {
  uses = "actions/npm@e7aaefe"
  needs = ["Install packages"]
  args = "run build"
}

action "Setup Google Cloud" {
  uses = "actions/gcloud/auth@8ec8bfa"
  needs = ["Deploy branch filter"]
  secrets = ["GCLOUD_AUTH"]
}

action "Deploy" {
  uses = "actions/gcloud/cli@8ec8bfa"
  needs = ["Build", "Setup Google Cloud"]
  args = "app deploy --project tbatv-prod-hrd --version 1 --quiet"
}
