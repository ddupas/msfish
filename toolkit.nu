# see config_local.nu for 
# $env.config.hooks.env_change = {
# which loads toolkit.nu if exists

# loads my ssh options for this repo
export-env {
  use ssh-env.nu
}

# per project git configuration
# along with git config user.name and user.email (not global)
#sample ssh-env
#export-env { 
#$env.GIT_SSH_COMMAND = "ssh -i ~/.ssh/id_rsa.projectx -o CertificateFile=~/.ssh/id_rsa.projectx-cert.pub"  
#}

# load node
def main [ ] {
asdf local nodejs latest
}
