#!/usr/bin/env bash

export ONF_ACCESS_KEY=$1
export ONF_SECRET_KEY=$2
export ONF_WORKSPACE_ID=$3

network_key=$4
sub_command=$5
action=$6
image_version=$7
percent=$8
echo "env: ${ONF_ACCESS_KEY} ${ONF_SECRET_KEY} ${ONF_WORKSPACE_ID}"

# production
# curl -s https://raw.githubusercontent.com/OnFinality-io/onf-cli/master/scripts/install/install.sh | bash
# onf="onf"

# test
curl -s https://raw.githubusercontent.com/OnFinality-io/onf-cli/feature/networkV2/scripts/install/install.sh | bash
onf="onf"

# git clone https://github.com/OnFinality-io/onf-cli.git
# cd onf-cli
# git checkout feature/networkV2
# onf="go run cmd/*.go  -p prod"

exeCmd="${onf} --help"
case $sub_command in
    image)
        exeCmd="${onf} ${sub_command} ${action} -n ${network_key} -v ${image_version}"
    ;;
    node)
        exeCmd="${onf} ${sub_command} ${action} -n ${network_key} -v ${image_version}"
        if [ -n "$percent" ]; then  
            exeCmd="${exeCmd} --percent ${percent}"
        fi
    ;;
    *)
    echo "Unknown command"
    ;;
esac
echo " Execute cmd is :${exeCmd}"

$exeCmd


# time=$(date)
# echo "::set-output name=time::$time"