
const core = require('@actions/core');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const os = require('os');
const request = require('request');
const io = require('@actions/io');
const fs = require('fs');



(async () => {
  try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);

    const onf_access_key = core.getInput('onf-access-key')
    const onf_secret_key = core.getInput('onf-secret-key')
    const onf_workspace_id = core.getInput('onf-workspace-id')
    const onf_network_key = core.getInput('onf-network-key')
    const onf_sub_command = core.getInput('onf-sub-command')
    const onf_action = core.getInput('onf-action')
    const image_version = core.getInput('image-version')
    const percent = core.getInput('percent')
    
    core.exportVariable("ONF_ACCESS_KEY",onf_access_key)
    core.exportVariable("ONF_SECRET_KEY",onf_secret_key)
    core.exportVariable("ONF_WORKSPACE_ID",onf_workspace_id)

    // console.log(`ENV ${onf_access_key} ${onf_secret_key} ${onf_workspace_id}`);

    const platform = getPlatform()
    // console.info(`${platform}`)
    const URL_VERSION = "https://raw.githubusercontent.com/OnFinality-io/onf-cli/feature/networkV2/VERSION"


    const version = await doRequest(URL_VERSION);
    console.log(`version: ${version}`)
    let URL = ""
    switch (platform) {
      case 'darwin' :
        URL=`https://github.com/OnFinality-io/onf-cli/releases/download/v${version}/onf-darwin-amd64-v${version}`
        break;
      case 'windows' :
        URL=`https://github.com/OnFinality-io/onf-cli/releases/download/v${version}/onf-windows-amd64-v${version}.exe`
        break;
      case 'linux' :
        URL=`https://github.com/OnFinality-io/onf-cli/releases/download/v${version}/onf-linux-amd64-v${version}`
        break;
    }
    let cmd_onf = "onf"
    if(platform === "windows"){
      cmd_onf = `${cmd_onf}.exe`
    }
    console.log(`Download onf command from  ${URL}. ${cmd_onf}`);
    if(fs.existsSync(cmd_onf)){
      io.rmRF(cmd_onf)
    }

    const downScript =  await tc.downloadTool(URL,cmd_onf)
    // console.log(`DownScript payload: ${downScript}`);
    
    if(platform != "windows"){
      await exec.exec(`chmod 773 ${cmd_onf}`);
    }

    let letsubCMd = `${onf_sub_command} ${onf_action} -n ${onf_network_key} -v ${image_version}`

    switch (onf_sub_command) {
      case 'image' :
        break;
      case 'node' :
        if(percent){
          letsubCMd  = `${letsubCMd} --percent ${percent}`
        }
        break;
    }

    const n = await exec.exec(`./${cmd_onf}`,letsubCMd.split(" "));
    // const n = await exec.exec(`./${cmd_onf}`,["node","list"]);
    // console.log(`Exec payload: ${n}`);
    
    

    
  } catch (error) {
    // core.setFailed(error.message);
    console.log(error.message);
  }
})();


function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

function getPlatform() {
  // darwin and linux match already
  // freebsd not supported yet but future proofed.

  // 'aix', 'darwin', 'freebsd', 'linux', 'openbsd', 'sunos', and 'win32'
  let plat = os.platform();

  // wants 'darwin', 'freebsd', 'linux', 'windows'
  if (plat === 'win32') {
    plat = 'windows';
  }

  return plat;
}

function getArch() {
  // 'arm', 'arm64', 'ia32', 'mips', 'mipsel', 'ppc', 'ppc64', 's390', 's390x', 'x32', and 'x64'.
  let arch = os.arch();

  // wants amd64, 386, arm64, armv61, ppc641e, s390x
  // currently not supported by runner but future proofed mapping
  switch (arch) {
    case 'x64':
      arch = 'amd64';
      break;
    // case 'ppc':
    //   arch = 'ppc64';
    //   break;
    case 'x32':
      arch = '386';
      break;
  }

  return arch;
}
