# Onfinality Release GitHub Action
Automatically publish docker image version to Onfinality platform through Github Action.
## Features
- Batch update node image version.
- Automatically update network image version.

## Usage
#### Basic Example
```yaml
on: 
  release:
    types: [created]

jobs:
    - name: onf upgrade
      uses: "OnFinality-io/action-onf-release@v1"
      with:
        onf-access-key: "${{ secrets.ONF_ACCESS_KEY }}"
        onf-secret-key: "${{ secrets.ONF_SECRET_KEY }}"
        onf-workspace-id: "${{ secrets.ONF_WORKSPACE_ID }}"
        onf-network-key: "${{ secrets.NETWORK-KEY }}"
        onf-sub-command: node # node or image
        onf-action: upgrade # upgrade or add
        image-version: v0.9.9
        percent: 30

```
## Parameters

|Parameter|**Mandatory**/**Optional**  | Description |
|--|--|--|
| onf-workspace-id | **Mandatory** | Your workspace id on Onfinality platform. |
| onf-access-key | **Mandatory** | Access key.How to get: [https://app.onfinality.io/account](https://app.onfinality.io/account) |
| onf-secret-key | **Mandatory** | Secret key.How to get: https://app.onfinality.io/account |
| onf-network-key | **Mandatory** | How to get: `onf network-spec list`|
| onf-sub-command | **Mandatory** | `image` update image version of network.  `node` batch release node's image|
| onf-action | **Mandatory** |  Action `add` for image command. Action `upgrade` for node command.|
| image-version | **Mandatory** | Image tags on dockerhub. This must be public |
| percent | **Optional** | Batch update the percentage of node image version. Only used on the node command. |

## More Examples
|  Examples | Describtion |
| ------------ | ------------ | 
|  https://github.com/OnFinality-io/action-onf-release-sample | Batch upgrade node's image version|

