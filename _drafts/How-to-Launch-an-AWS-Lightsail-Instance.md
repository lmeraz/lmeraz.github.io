First log in to the AWS management console. Search for Lightsail in the AWS services search bar. CLick on the drop down. You'll be greeted by the Amazon Lightsail COnsole.

[lightsailconsole.jpg] 


Click on 'Create instance' to create an instance.

Select Your instance location:
Lightsail is avaialble worldwide. here are up to 6 Availability Zones in each region that you can choose from. Choose an AWS Region based on your location to reduce latency for you or your users. Choose your preferred Availibility Zone. An availavility Zone is a physical location within the region. Each AWS Region has up to six abailbiility zones idenfied like 'us-east-2a'. By launching instances or databases in separate Availbility Zones you can protect your applications from the failure of a single location.

Pick Your instance image:
Lightsail comes with several blueprint options. TO install Ubuntu Choose the Linux/Unix platform. Use the blueprint filter and select 'OS Only'. Then select Ubuntu. Either 16.04LTS or 18.04 LTS.

Add a launch script
You can write and use a script to configure your virtual private server (or instance) when it starts up. These scripts can add software, update software, or configure your instance in some other way. For Linux/Unix-based instances, you can write a shell script or a bash script to configure your instance right after Lightsail creates it.
Additionally, you can add a launch script to be run when your isntance is first created. This is a script with shell commands. Typically, it can be used to boot up the isntance to the specifications you want. In our case we'll update, install, and reboot our instance prior to connecting to it.

CHange your ssh key pair.
Secure SHell (SSH) is a protocol for securely connecting to your Linux/Unix-based Amazon Lightsail instance (a virtual private server). SSH works by creating a public key and a private key that match the remote server to an authorized user.

Choose Default to use the default key pair that Lightsail creates to connect to your Linux instance. When you create an instance in an AWS Region, Lightsail creates a region-specific default key. You can download the default private key if you also want to connect to your Lightsail instance using an SSH client such as PuTTY.

 A default ssh key pair is provided for download. This ssh key pair is tied to the region. If you plan to launch in multiple regions consider creating tyour own ssh key pair and uploading it.
For Linux-based instances, Lightsail uses Secure SHell (SSH) to connect to your instance (a virtual private server). SSH uses a key pair (a public key and a private key) to match the remote server to an authorized user.

Lightsail creates a default key pair in each AWS Region where you create an instance. Choose Download to download the default private key if you also want to connect to your Lightsail instance using an SSH client such as PuTTY.

When you download the default private key, we include the name of the region at the end of the file name. For example, LightsailDefaultPrivateKey-us-east-2 for the Ohio Region.

Choose your instance plan:
We tried to make our pricing plans as simple as possible.

Data transfer rates refer to data transferred "in" to and "out" of Amazon Lightsail. The way this is billed is explained on this page.

For Linux/Unix-based instances, you can try the $3.50 USD Lightsail plan free for one month (up to 750 hours). Choose a $3.50 plan when you launch your first Lightsail server, and we will credit one free month to your account.

For Windows-based instances, you can try the $8 USD Lightsail plan free for one month (up to 750 hours). Choose a $8 USD plan when you launch your first Lightsail server, and we will credit one free month to your account.

Identify your instance:
Name it your preffered name. Then add key or key value tags


Note

Choose your preferred instance type. The cost is the cost you will be billed monthly. 

Enable Automatic Snapshots.
Amazon Lightsail allows you to assign labels to your resources as tags. A key without a value is referred to as a key-only tag. It can be used to filter and organize your resources in the Lightsail console.

Amazon Lightsail allows you to assign labels to your resources as tags. A key with a value is referred to as a key-value tag. It can be used to organize your billing, and to control access to your Lightsail resources.

Click create instance!

COnfigure ssh

move your ssh lfe to ~/.ssh/
chmod 400 the file

add the following to config
Host lightsail
HostName 54.202.143.161
User ubuntu
IdentityFile ~/.ssh/lightsail.pem

ssh lightsail



Lightsail is available worldwide. Choose Change AWS Region and Availability Zone to view the available regions.

Each AWS Region has up to six Availability Zones. We use letters to identify them, such as us-east-2a.

By launching your instances or databases in separate Availability Zones, you can protect your applications from the failure of a single location.



The authenticity of host '54.202.143.161 (54.202.143.161)' can't be established.
ECDSA key fingerprint is SHA256:NbvqKgPevVZaIhj02wy+5lkPTD9GygzOJTQaAYoM+0c.
Are you sure you want to continue connecting (yes/no)? 

chmod 400 ~/.ssh/lightsail.pem 
sudo apt-get update
sudo apt-get -y upgrade
sudo shutdown -r now
