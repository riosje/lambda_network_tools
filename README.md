# lambda_network_tools


## Examples

### NMAP
This command is able to validate if a TCP port is open or not and return which kind of service is running on it.
```JSON
{
   "cmd":"nmap",
   "host":"HOSTNAME",
   "port":"1234"
}
```

### PING
Perform a ping to a specified Hostname or IP
```JSON
{
   "cmd":"ping",
   "host":"google.com"
}
```

### MSSQL CONNECTION
This command connect to an SQL server instance and peroforms this query `SELECT 1+1` just to validate the connection.
```JSON
{
   "cmd":"mssql",
   "host":"10.0.0.1",
   "database": "dbName",
   "username": "dbUserName",            
   "password": "P4$$W0RD",
   "options": {
        "encrypt": false,
        "trustservercertificate": true //Use with self signed certs
   }
}
```