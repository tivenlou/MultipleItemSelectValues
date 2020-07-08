'use strict'
console.log('local test')
const fs = require('fs')
const bigInt = require("big-integer");

// 1-1 create new values 產生新的總權值
var totalValueBigInt = bigInt(0) // init 總權值的 bigInt Object
var itemListArray = [1,2,3,4,5,6,7,8,9,10] // 1～10項都有權限的總權值 ＝ 2^10 - 1

// =====================
// var itemListArray = fs.readFileSync('./10000.json')
// itemListArray = Buffer.from(itemListArray)
// console.log('所有項次 itemListArray=', JSON.parse(itemListArray.toString()));
// itemListArray = JSON.parse(itemListArray.toString())
// =====================

for (var i in itemListArray) {
  var itemIndexNow = itemListArray[i]
  var itemValue = bigInt(2).pow(itemIndexNow - 1)
  totalValueBigInt = totalValueBigInt.add(itemValue)
}

// var totalValueBigInt = bigInt(2).pow(10000 - 1).subtract(1) // 10000value.text = 10000全部項次都有權限的最大值 = 2^N - 1
var totalItemCounts = 100 // 全部的可多重選擇的項次數量最大值 (數量可到千萬或更高到100000000)
var maxValues = bigInt(2).pow(totalItemCounts - 1).subtract(1) // 全部項次都有權限的最大值 = 2^N - 1

var itemIndex = 15 // 當前要檢驗 第N項次 不可大於 totalItemCounts
var currentValue = bigInt(2).pow(itemIndex - 1) // 當前要檢驗項次的權值

var fristItemExist = totalValueBigInt.isOdd() // 是否為奇數，true為有第一項的權限
if (fristItemExist) {
  console.log('第[1]項次有權限');
}

if (bigInt(totalValueBigInt).equals(maxValues) ) {
  // 全部項次都有權限
  console.log('全部項次都有權限');
}

// 2-1 insert value 新增第N項次權值
// 檢驗第N項次的權值
console.log('檢驗第['+ itemIndex +']項次的權值是否已經有權限了，如沒有權限就 新增項次到總權值中');

var result = selectValueAction(totalValueBigInt, currentValue, itemIndex)
if (result) {
  // console.log('第['+ itemIndex +']項次 已經有權限了');
} else {
  console.log('"沒有"第['+ itemIndex +']項次的權限');
  // 新增項次到總權值中，產生新的總權值
  totalValueBigInt = totalValueBigInt.add(currentValue)
  console.log('新增第['+ itemIndex +']項次到總權值中，產生新的總權值');
  // 檢驗第N項次的權值
  var result = selectValueAction(totalValueBigInt, currentValue, itemIndex)
}

// 3-1 remove value 移除第N項次權值
// 從總權值中 移除第N項次權限，產生新的總權值
var deleteItemIndex = 5
var deleteItemIndexValue = bigInt(2).pow((deleteItemIndex - 1)) // 當前要 移除 項次的權值
totalValueBigInt = totalValueBigInt.subtract(deleteItemIndexValue)
console.log('從總權值中 移除第['+ deleteItemIndex +']項次，產生新的總權值');

// 檢驗第N項次的權值
var result = selectValueAction(totalValueBigInt, deleteItemIndexValue, deleteItemIndex)
// 已從總權值中 移除

// 5-1 scan all values 列出已存在的所有項次（總權值中）
// 過濾已有權限的項次列表List
var listArray = []
var bitLength = totalValueBigInt.bitLength()// 理論上 當前最大項次的2位元長度值
do {
  console.log('檢驗第['+ bitLength +']項次的權限');
  var selectCurrentValue = bigInt(2).pow(bitLength - 1) // 以當前最大項次 產生新的權值
  var allItemPassValue = bigInt(2).pow(bitLength).subtract(1)
  if (allItemPassValue.equals(totalValueBigInt)) {// 結果==時，代表剩下的項次全部都有權限了
    console.info('結果 allItemPassValue==totalValueBigInt時，代表剩下的項次全部都有權限了');
    console.info('項次['+ bitLength +']到項次[1] 全部都有權限了');
    var indexNow = bitLength.toJSNumber()
    for (let i=0;i<indexNow;i++) {
      listArray.push(( indexNow - i ).toString())
    }
    bitLength = bigInt(0)
    break
  } 

  if (selectCurrentValue.equals(totalValueBigInt)) {
    console.info('結果==時，代表只有第['+ bitLength +']項次的權限了');
    listArray.push(bitLength.toString())
    totalValueBigInt = bigInt(0)
    bitLength = bigInt(0)
    break
   } else if (selectCurrentValue.greater(totalValueBigInt)) {
      console.error('"沒有"第['+ bitLength +']項次的權限');
   } else if (selectCurrentValue.lesser(totalValueBigInt)) {
      // 檢驗第N項次的權值
      var result = selectValueAction(totalValueBigInt, selectCurrentValue, bitLength)
      if (result) {
        // console.info('第['+ bitLength +']項次有權限了');
        var newTotalValueBigInt = totalValueBigInt.subtract(selectCurrentValue)// 扣除該項次的權值，產生新的總權值
        totalValueBigInt = newTotalValueBigInt
        listArray.push(bitLength.toString())
      }
   } else {
    console.log('unknow error');
    break
   }
   bitLength.subtract(-1)// 項次 -1
   // 比對新的總權值當前2位元長度值
   var currentBitLength = totalValueBigInt.bitLength()
   if (bitLength.greater(currentBitLength)) bitLength = currentBitLength // 直接指向最近的項次

} while (bitLength.greater(0) || totalValueBigInt.neq(0) );

console.log('finish action list=', listArray);

// 4-1 select value 驗證第N項次權值
/**
 * 驗證第N項次權值
 * @param {*} totalValueBigInt 總權值
 * @param {*} currentValue 當前項次的權值
 * @param {*} itemIndex 當前項次
 */
function selectValueAction (totalValueBigInt, currentValue, itemIndex) {
  var result = Boolean()
  // 檢驗第N項次的權值
  // console.log('檢驗第['+ itemIndex +']項次的權限中...');
  var modValues = bigInt(totalValueBigInt).divmod(currentValue)
  if (bigInt(modValues.quotient).isOdd()) {
    result = true
  }
  if (result) {
    // console.log('第['+ itemIndex +']項次已經有權限了');
  } else {
    // console.warn(' "沒有" 第['+ itemIndex +']項次的權限');
  }
  return result
}
