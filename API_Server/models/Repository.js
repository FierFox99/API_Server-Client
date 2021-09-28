
const fs = require('fs');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports =
    class Repository {
        constructor(objectsName) {
            this.objectsList = [];
            this.objectsFile = `./data/${objectsName}.json`;
            this.read();
        }
        read() {
            try {
                // Here we use the synchronus version readFile in order  
                // to avoid concurrency problems
                let rawdata = fs.readFileSync(this.objectsFile);
                // we assume here that the json data is formatted correctly
                this.objectsList = JSON.parse(rawdata);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    // file does not exist, it will be created on demand
                    this.objectsList = [];
                }
            }
        }
        write() {
            // Here we use the synchronus version writeFile in order
            // to avoid concurrency problems  
            fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
            this.read();
        }
        nextId() {
            let maxId = 0;
            for (let object of this.objectsList) {
                if (object.Id > maxId) {
                    maxId = object.Id;
                }
            }
            return maxId + 1;
        }
        add(object) {
            try {
                object.Id = this.nextId();
                this.objectsList.push(object);
                this.write();
                return object;
            } catch (error) {
                return null;
            }
        }
        getAll() {

            return this.objectsList;
        }
        getAllSorted(sort) {
            var array = [];

            for (var o in this.objectsList) {

                array.push(this.objectsList[o]);
            }

            if (sort == "name") {
                array = this.sort(array, "Name");
            }
            else if (sort == "category") {
                array = this.sort(array, "Category");
            }

            return array;
        }
        getByKey(key, value) {

            // console.log("test");
            // console.log(value);
            // // let sorted;
            // // sorted = Object.keys(this.objectsList).find(key => this.objectsList[key] === value);

            // const key = Object.keys(this.objectsList).find(key => this.objectsList[key] === value);
            // console.log(value);
            var array = [];

            for (var o in this.objectsList) {

                if (this.objectsList[o] == value)
                    array.push(this.objectsList[o]);
            }



            console.log(key);
            console.log(this.objectsList[key] == value);
            return array;
        }
        get(id) {
            for (let object of this.objectsList) {
                if (object.Id === id) {
                    return object;
                }
            }
            return null;
        }
        remove(id) {
            let index = 0;
            for (let object of this.objectsList) {
                if (object.Id === id) {
                    this.objectsList.splice(index, 1);
                    this.write();
                    return true;
                }
                index++;
            }
            return false;
        }
        update(objectToModify) {
            let index = 0;
            for (let object of this.objectsList) {
                if (object.Id === objectToModify.Id) {
                    this.objectsList[index] = objectToModify;
                    this.write();
                    return true;
                }
                index++;
            }
            return false;
        }

        sort(theObject, sort) {
            var array = [];

            for (var o in theObject) {

                array.push(theObject[o]);
            }

            var sortedArray = array.sort(function (a, b) {
                if (a[sort] < b[sort])
                    return -1;
                else if (a[sort] == b[sort])
                    return 0;
                else
                    return 1;
            });

            return sortedArray;
        }
    }