#!/usr/bin/env python
# coding: utf-8

# In[6]:


train_A1 = [5,5.11,5.6,5.9,4.8,5.8,5.3,5.8,5.5,5.6]
train_A2 = [45,26,30,34,40,36,19,28,23,32]
label = ['H','L','M','M','H','M','L','M','L','M']
# cho điểm test 
test_a1=5.5
test_a2=38
print(len(train_A1))
print(len(train_A2))
print(len(label))


# In[13]:


import math
def get_dis(test_a1,test_a2,train_A1,train_A2):
    dis = []
    for i in range(len(train_A1)):
        d = (train_A1[i] - test_a1)**2 + (train_A2[i] - test_a2)**2
        dis.append(math.sqrt(d))
    return dis
print(get_dis(test_a1,test_a2,train_A1,train_A2))


# In[19]:


d = get_dis(test_a1,test_a2,train_A1,train_A2)
for i in range(len(d)):
    print(d[i],end = " ")
    print(label[i])


# In[20]:


pip install numpy


# In[ ]:




