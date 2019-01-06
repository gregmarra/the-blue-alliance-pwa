workflow "Build and deploy" {
  on = "push"
  resolves = ["Deploy", "Setup Google Cloud"]
}

action "Install packages" {
  uses = "actions/npm@e7aaefe"
  runs = "install"
}

action "Build" {
  uses = "actions/npm@e7aaefe"
  runs = "run build"
  needs = ["Install packages"]
}

action "Setup Google Cloud" {
  uses = "actions/gcloud/auth@8ec8bfa"
  secrets = ["GCLOUD_AUTH"]
}

action "Deploy" {
  uses = "actions/gcloud/cli@8ec8bfa"
  needs = ["Build", "Setup Google Cloud"]
  args = "app deploy --project tbatv-prod-hrd --version 1 --quiet"
}
