const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

exports.handler = async function(event) {
    const sql = require('mssql')
    const input = {
        cmd: event.cmd == 'nmap' ? 'nmap' 
            : event.cmd == 'ping' ? 'ping' 
            : event.cmd == 'traceroute' ? 'traceroute' 
            : event.cmd == 'dig' ? 'dig'
            : event.cmd == 'mssql' ? 'mssql'
            : ''
    }
    let response = {
        status: true,
        body: ""
    }
    try {
        switch (input.cmd) {
            case 'nmap':
               const nmapResponse = await exec(`${input.cmd} -sT -p ${event.port} ${event.host} --version-all`, { shell: true });
                if (nmapResponse.stderr) {
                     console.log(nmapResponse.stderr)
                     response.body = nmapResponse.stderr
                }
                response.body = nmapResponse.stdout
                break;

            case 'ping':
                const pingResponse = await exec(`${input.cmd} ${event.host} -c 3`, { shell: true });
                if (pingResponse.stderr) {
                    console.log(pingResponse.stderr)
                    response.body = pingResponse.stderr
                }
                response.body = pingResponse.stdout
                break;

            case 'whois':
            const whoisResponse = await exec(`${input.cmd} ${event.hostname}`, { shell: true });
            if (whoisResponse.stderr) {
                console.log(whoisResponse.stderr)
                response.body = whoisResponse.stderr
            }
            response.body = whoisResponse.stdout
            break;

            case 'mssql':
                const sqlConfig = {
                    user: event.username,
                    password: event.password,
                    database: event.database,
                    server: event.host,
                    connectionTimeout: 3000,
                    port: event.port || 1433,
                    options: {
                      encrypt: event.options.encrypt || false,
                      trustServerCertificate: event.options.trustservercertificate || false,
                      instanceName: event.options.instancename || ''
                    }
                }
                const sqlConnect = await sql.connect(sqlConfig)
                console.dir(sqlConnect)
                if (sqlConnect) {
                    const sqlResponse = await sql.query`SELECT 1+1`
                    response.body = sqlResponse.recordset
                    sql.close()
                }
                break;
            default:
                return response;
        }
    } catch (error) {
        response.status = false
        response.body = error
        console.error('error:', error);
        return response
}
}
