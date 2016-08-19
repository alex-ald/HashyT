function HashTable() {
    this._curSize = 0;  // # of tuples, (key, value), in the storage array
    this._limit = 7;    // The capacity of the hashtable; capable of being resized
    this._storage = []  // Stores the tuples (key, value)
}

/*
    SDBM Hashing Algorithm
    Description: This was chosen for causing decent distribution of the keys and fewer splits.
    Resource: http://www.cse.yorku.ca/~oz/hash.html 
*/    
HashTable.prototype.HashFunc = function (key) {
    var hashValue = 0;
    
    for(var i = 0; i < key.length; i++) {
        hashValue = key[i].charCodeAt(0) + (hashValue << 6) + (hashValue << 16) - hashValue;
    }
    // account for the Array Size
    hashValue = mod(hashValue, this._limit);
    
    return hashValue
}

/*
    Insert: The function will insert the tuple, (key, value), in the storage array,
    by first checking if the array needs to be resize. Next, obtain the hashed index
    from the key and get the bucket. Then we will check if the bucket is empty and if so
    create the bucket and push the tuple in the bucket. If it exists, then check if the
    unhashed key is in the bucket, if so then overwrite the value with the new value.
*/
HashTable.prototype.Insert = function(key, value) {
    // Check if storage needs to be resized, if so then resize it
    if(this.isNeededToResize())
        this.resize();        
    
    // get the hash value by calling hashFunc
    var index = this.hashFunc(key);
    console.log('index: ' + index + '; key: ' + key + '; value: ' + value);
    
    // get the bucket containing the tuples with the same hash value
    var bucket = this._storage[index];
    
    if(!bucket) // Check if the bucket is empty
    {
        // if there is not a bucket, create one and then place the tuple in the new bucket
        bucket = [];
        bucket.push({key:key, value:value});
    } else {    // check if the key is in the bucket if not empty
        for(var i = 0; i < bucket.length; i++){ // iterate through the tuples in the bucket
            if(bucket[i].key === key) {
                return false // if key already exist, then return false
            }
        }
        bucket.push({key:key, value:value});
    }
    // place the bucket back in storage
    this._storage[index] = bucket;
    
    // increment current size counter
    this.curSize++;
    
    return true
}

/*
    Remove: The function will remove the tuple containing the key and value, by 
    obtaining the bucket with the hashed index form the key, and if empty then 
    return null and if the un hashed key is located in the bucket, then return
    true. If it is not in the bucket, then return false; 
*/
HashTable.prototype.Remove = function (key) {
    // get the hash value to get the index of the value needed
    var hashVal = this.hashFunc(key);
    // get the bucket that could contain the tuple
    var bucket = this._storage[hashVal];
    
    if(!bucket) { // return null if the the key leads to nothing
        return false
    } else { // iterate through the bucket to locate the key
        for(var i = 0; i < bucket.length; i++) {
            if(bucket[i].key === key) {
                bucket.splice(i, 1);
                this._storage[hashVal] = bucket;
                return true
            }
        }
        return false
    }   
}

/*
    View: The function will get the bucket from the hashed key index,
    and if it is empty then return null and if it exist, then locate the
    key and return the value attached to it. If the key does not exist 
    in the non-empty bucket, then return null.
*/
HashTable.prototype.View = function (key) {
    // get the hash value to get the index of the value needed
    var hashVal = this.hashFunc(key);
    // get the bucket that could contain the tuple
    var bucket = this._storage[hashVal];
    
    if(!bucket) { // return null if the the key leads to nothing
        return null
    } else { // iterate through the bucket till the key is found, then return the value
        for(var i = 0; i < bucket.length; i++) {
            if(bucket[i].key === key)
                return bucket[i].value;
        }
        
        return null
    }
}

/*
    Resize: When it is time to resize the storage Hash Table,
    we will simply extend the limit size. 
*/
HashTable.prototype.Resize = function () {
    // we will double the size of the storage array and find the next prime for the size
    this._limit = getNextPrime(this._limit * 2);
}

/*
    isNeededToResize: verifies if function is needed to be resized
    and will return a boolean value
*/       
HashTable.prototype.isNeededToResize = function () {    
    return this._curSize > (this._limit * .75) ? true : false;
}

// created a custom modulus function to account for negative numbers 
function mod(n, m) {
    return ((n % m) + m) % m;
}

function getNextPrime(num) {
    // if the number is even, then increment by one to make it odd
    if(num % 2 === 0) num++;
    
    // increment the number until we have reached a prime number
    while(!isPrime(num)) {
        num += 2;
    }
    return num
}

function isPrime(num) {
    for(var i = 2; i < num; i++) { // check every number below the given number if it is divisible by it
        if(num % i === 0) return false
    }
    return true
}

function HashyT() {
    return new HashTable()
}

module.exports = HashyT