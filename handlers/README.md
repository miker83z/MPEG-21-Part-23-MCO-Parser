#Handlers
The functions in this folder call the Generators functions and handle the inter-correlation between Class fields. For instance, a Party Object is created not only by parsing an Element in the MCO Contract of Party type,but also by gathering information from Action and Deontic type Elements.

### Generic flow of execution of an handler

0. Each handle function (e.g. handleAction()) is used to manage the information gathered from a MCO contract Element. The parameters for such function are usually:
   - the jsonLD graph representing the MCO contract;
   - the Media Contractual Objects Set to "fill";
   - the "classData", i.e. the information gathered from the classes LUT
   - the Element itself (as a json object)
   - the id of the contract of reference
1. If the Element has already been parsed the function stops
2. Else it generate the specific Media Contractual Object (e.g. an Action) by calling the associated Generator (e.g. generateAction()), and then adds it to the Media Contractual Objects Set
3. Then it updates the list associated to that type of object in the Contract Object with id specified in the comments (e.g. field actions in Contract)
4. Finally it updates (or creates an Object from scratch) all the other Objects that are associated to it. For each case it searches for the id in the jsonLD graph, and then generates the Object by calling the appropriate generator if it was undefined, or updates a field. For instance, the handleAction() updates (or creates):
   - a party with the field "actionsIsSubject"
   - all the actions in the "impliesAlso", "incomeSources", "isAbout" fields
   - all the parties in the "rightGivenBy", "recipients", "beneficiaries" fields
