echo "installing ansible"
sudo apt-add-repository ppa:ansible/ansible >/dev/null 2>&1
sudo apt-get update >/dev/null 2>&1
sudo apt-get install -y ansible git >/dev/null 2>&1

cd /vagrant/provisioning

echo "get galaxy dependencies"
ansible-galaxy install -r requirements.yml -p roles --ignore-errors

echo "executing ansible"
ansible-playbook -i "localhost," -c local playbook.yml
