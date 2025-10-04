const iCrypto  =  0;
const iType    =  1;
const iDate    =  3;
const iTx      =  4;
const iTokenID =  6;
const iHBS     =  7;
const iURL     =  8;
const iCIDv1   =  9;
const iTiker   = 12;


function tokenIndex(tokenId) {
    var index;
    for (var i = 0; i < nd.length; i++) {
      if (nd[i][iTokenID] == tokenId) {
        return i;
        break;
      }
    }
    return -1;
}


function get_jpgstoreId(tokenIndex) {
    const PolicyID = '1f3b61aa78e9a73b28ea5b09c09993a8086e62cc0f240836524e4338';
    var tiker = nd[tokenIndex][iTiker]
    return PolicyID + tiker.split("").map(x=>(256+x.charCodeAt()).toString(16).substr(-2)).join("");
};


function onload(domain='ipfs') {
    const timestampCurr = new Date().getTime()

    for(let cell of document.getElementsByTagName('td')) {
        var t = '';

        var id = cell.getAttribute("data-id");
        if (id != null && id != "") { 
            var ti = tokenIndex(id);
            if (ti < 0) {
                console.log('No such token id! ' + id);
                continue;
            }


            var timestampId = nd[ti][iDate];
            var difference  = timestampCurr - timestampId;
            var tokenAge    = Math.floor(difference/1000/60/60/24);
            if ((365 - tokenAge % 365) < 7) {
                var tcd = new Date(timestampId); 
                tcd = tcd.getDate() + "/" + (tcd.getMonth() + 1) + "/" + tcd.getFullYear();
                ta = '<font class="aid">BD:</font> <font class="aia" title="Token\'s date of birth (minting date)">' + tcd + '</font>';
            } else {
                ta = '<font class="aid">Age:</font> <font class="aia" title="Token\'s age, days">' + tokenAge + '</font> <font class="aid">d</font>';
            }
                        
            var hbs = nd[ti][iHBS];
            var crypto = nd[ti][iCrypto];
            if (domain != "github") {
                switch (hbs) {
                    case "D":
                        t = '\n<font class="aih">BURNED</font>&nbsp;&nbsp;';
                        break;
                    case "H":
                        t = '\n<font class="aih">HOLD</font>&nbsp;&nbsp;';
                        break;
                    case "B":
                        t = '\n<font class="aib">BUY</font>&nbsp;&nbsp;';
                        break;
                    case "S":
                        t = '\n<font class="ais">SOLD</font>&nbsp;&nbsp;';
                        break;
                    default:
                        t = '';
                }    

                switch (crypto) {
                    case "ADA":
                          idj = get_jpgstoreId(ti);
                        t = t +
                            '<a href="https://www.jpg.store/asset/'         + idj+ '">jpg.store</a>' + '\n&nbsp;&nbsp;' +
                            '<a href="https://pool.pm/'                     + id + '">pool.pm</a>'   + '\n&nbsp;&nbsp;' +
                            ta;
                        break;

                      case "ETH":
                        t = t +
                            '<a href="https://opensea.io/assets/ethereum/0x495f947276749ce646f68ac8c248420045cb7b5e/'
                                                                            + id + '" title="opensea.io">OpenSea</a>' + '\n&nbsp;&nbsp;' +
                            ta;
                        break;
                    
                    case "ERG":
                        t = t +
                            '<a href="https://ergoauctions.org/artwork/'    + id + '" title="ergoauctions.org">AH</a>'           + '\n&nbsp;&nbsp;' + 
                            '<a href="https://mart.mewfinance.com/explore?seller=9i27TRCWjZazUW5p6FKYd8PowDG3SKZGd24nsbrUsEbUk31ocFi&tokenId='    + id + '" title="mewfinance.com">MEW</a>'           + '\n&nbsp;&nbsp;' +
                            '<a href="https://ergexplorer.com/token#'       + id + '" title="ergexplorer.com" >ergexplorer'      + '\n&nbsp;&nbsp;' +
                            '<a href="https://ergotokens.org/#/?token=' + id + '" title="ergotokens.org">et</a>' + '\n&nbsp;&nbsp;' +
                            '<a href="https://explorer.ergoplatform.com/en/transactions/' + nd[ti][iTx] + '">' +
                            ta +
                            '</a>'
                        break;
                    
                    case "TON":
                        t = t +
                            '<a href="https://getgems.io/nft/'              + id + '" title="getgems.io">getgems</a>'                 + '\n&nbsp;&nbsp;' + 
                            '<a href="https://explorer.tonnft.tools/nft/'   + id + '" title="explorer.tonnft.tools">tonnft.tools</a>' + '\n&nbsp;&nbsp;' +
                            ta;
                        break;
                        
                    default:
                        t = t + ta;
                }
            } else {
                switch (crypto) {
                    case "ADA":
                          idj = get_jpgstoreId(ti);
                        t = t +
                            '<a href="https://pool.pm/'                     + id + '">pool.pm</a>'   + '\n&nbsp;&nbsp;' +
                            ta;
                        break;

                      case "ETH":
                        t = t +
                            ta;
                        break;
                    
                    case "ERG":
                        t = t +
                            '<a href="https://ergexplorer.com/token#'       + id + '" title="ergexplorer.com" >ergexplorer'      + '\n&nbsp;&nbsp;' +
                            '<a href="https://ergotokens.org/#/?token=' + id + '" title="ergotokens.org">ergotokens</a>' + '\n&nbsp;&nbsp;' +
                            '<a href="https://explorer.ergoplatform.com/en/transactions/' + nd[ti][iTx] + '">' +
                            ta +
                            '</a>'
                        break;
                    
                    case "TON":
                        t = t +
                            '<a href="https://explorer.tonnft.tools/nft/'   + id + '" title="explorer.tonnft.tools">tonnft.tools</a>' + '\n&nbsp;&nbsp;' +
                            ta;
                        break;
                        
                    default:
                        t = t + ta;
                }
            }
            
            var Type = nd[ti][iType];
            switch (Type) {
                case "N":
                    var URL  = nd[ti][iCIDv1];
                    if (URL == '') {
                        URL = nd[ti][iURL];
                        if (crypto == 'ETH') {
                            URL = 'https://dl.openseauserdata.com/cache/originImage/files/' + URL;
                        }
                    }
                    if (URL == 'ON_CHAIN_DATA') {
                        if (crypto == 'ERG') {
                            URL = 'https://explorer.ergoplatform.com/en/transactions/' + nd[ti][iTx];
                            cell.innerHTML = '<a href="' + URL + '" title="View source on-chain (R9 register)" class="ai">\n' + cell.innerHTML + '</a>' + t;
                        } else {
                            cell.innerHTML = cell.innerHTML + t;
                        }
                    } else {
                        cell.innerHTML = '<a href="' + URL + '" title="Open original" class="ai">\n' + cell.innerHTML + '</a>' + t;
                    }
                    break;
                    
                case "T":
                    if (crypto == 'ERG') {
                        URL = 'https://explorer.ergoplatform.com/en/issued-tokens?searchQuery=' + id;
                        cell.innerHTML = '<a href="' + URL + '" title="View original on-chain" class="ai">\n' + cell.innerHTML + '</a>' + t;
                    } else {
                        cell.innerHTML = cell.innerHTML + t;
                    }
                    break;
                    
                default:
                    t = t + ta;
            }
        }
    }

    return false;
}

