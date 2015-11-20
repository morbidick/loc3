VAGRANTFILE_API_VERSION = "2"


$setup = <<SCRIPT

dependencies="htop vim git nodejs npm mongodb"

function silent_install {
    apt-get -y install "$@" >/dev/null 2>&1
}

echo updating package information
apt-get -y update >/dev/null 2>&1

echo installing dependencies
silent_install $dependencies

if [ ! -f /usr/sbin/node ];
then
  echo creating node alias
  ln -s /usr/bin/nodejs  /usr/sbin/node
fi


if [ ! -f /usr/local/bin/meteor ];
then
  echo installing meteor 
  su vagrant
  cd ~
  wget -q https://install.meteor.com/ -O meteor-install.sh
  sh meteor-install.sh

  echo setting env to use installed mongodb
  echo "export MONGO_URL=mongodb://localhost:27017/meteor" >> ~/.bashrc

  exit
fi

echo done!
SCRIPT


Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 3000, host: 3000, auto_correct: true
  config.ssh.forward_agent = true
  config.vm.provision :shell, inline: $setup

  config.vm.provider "virtualbox" do |vb|
    vb.memory = 1024
    vb.cpus = 2
  end

end
