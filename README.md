${moduleName}
==========================

Description
-----------
This is a very basic module which can be used as a starting point in creating a new module.

Building from Source
--------------------
You will need to have Java 1.6+ and Maven 2.x+ installed.  Use the command 'mvn package' to 
compile and package the module.  The .omod file will be in the omod/target folder.

Alternatively you can add the snippet provided in the [Creating Modules](https://wiki.openmrs.org/x/cAEr) page to your 
omod/pom.xml and use the mvn command:

    mvn package -P deploy-web -D deploy.path="../../openmrs-1.8.x/webapp/src/main/webapp"

It will allow you to deploy any changes to your web 
resources such as jsp or js files without re-installing the module. The deploy path says 
where OpenMRS is deployed.

Installation
------------
1. Build the module to produce the .omod file.
2. Use the OpenMRS Administration > Manage Modules screen to upload and install the .omod file.

If uploads are not allowed from the web (changable via a runtime property), you can drop the omod
into the ~/.OpenMRS/modules folder.  (Where ~/.OpenMRS is assumed to be the Application 
Data Directory that the running openmrs is currently using.)  After putting the file in there 
simply restart OpenMRS/tomcat and the module will be loaded and started.

## Bilogocal Order Front-end app 
The source code for the oder front end app can be found under [orderApp](./orderApp/) folder . 
see [more](./orderApp/README.md)

### Instructions For Oder Front-end app developement 
1. Install Node and npm  
    see [instructions](https://linuxize.com/post/how-to-install-node-js-on-ubuntu-18.04/)

1. install pnpm  

       npm install -g pnpm

2. move to the orderApp directory   

       cd orderApp    

3. install dependencies  

       pnpm install  

4. Run in Dev mode  

       pnpm start

4. Build for production  

       pnpm build

# Build module and order app
  The Odrer front-end app will be built and packaged into the omod  as part of the maven build 
    
    mvn clean install  
