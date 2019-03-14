export const environment = {
  envName: 'prod',
  production: true,
  // You need to replace the IP address below with the
  // IP address of your droplet, which you can get
  // from the Digital Ocean dashboard. Make sure you
  // keep the port number (`:4567`) unless you
  // reconfigure the Java Spark server to use a
  // different port.
  API_URL: 'http://xxx.yyy.zzz.www:4567/api/'
};
