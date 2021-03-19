#Generators
The functions in this folder are used to generate the Media Contractual Objects. Each main class (e.g. Action, Party, IPEntity) has a generator file associated, where it is possible to find the structure of the Object and the generate method. The structure consists of a json object containing the Media Contractual Object fields as key and the field type as value. To create the object, the associations found in the proper LUT are used.

### Generic flow of execution of a generator

0. Each handle function (e.g. generateAction()) is used to generatean element Element gathered from the MCO contract. The parameters for such function are:
   - the "classData", i.e. the information gathered from the classes LUT
   - the payload, i.e. the Element itself (as a json object)
1. If the element is a sub-class of a main class (e.g. Payment is sub.class of Action) then the appropriate model for the sub-class is set
2. For each key found in the Element
   - if the key is found in the LUT, then the associated value is inserted into the generated object
   - **else the associated value is inserted into a map field called `extra`, in order to not lose any information**
3. Finally, the object is returned
