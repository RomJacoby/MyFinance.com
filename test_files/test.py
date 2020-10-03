import module_test
list1=[]
list2=[]
for i in range (0,(int)(input('how many loops?'))):
    name=input('whats your name?')
    list1.append(i+1)
    list2.append(name + ' yaya')
newdict = module_test.zipping(list1,list2)
print(newdict[1])
print(a)


