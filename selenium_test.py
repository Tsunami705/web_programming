from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.select import Select
import time
import random
import string

# Generate a random email
def generate_random_email():
    username = ''.join(random.choices(string.ascii_lowercase + string.digits, k=10))
    domain = random.choice(['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'])
    email = f"{username}@{domain}"
    return email

#Create Chrome browser instance
wd=webdriver.Chrome(service=Service(r'D:\chromedriver_win32\chromedriver.exe'))

# open the website
wd.get('http://twidder-mongo-101.azurewebsites.net/')

'''
Implicit wait:
Execute every 0.1 seconds until the element is successfully found
10 sec the largest waiting time
'''
wd.implicitly_wait(5)


'''
Function 1:SignUp

Test the sign up function

'''

# Select element by id and return the webElement object
sign_up_first_name=wd.find_element(By.ID,'first_name')
# Send the string to the input frame
sign_up_first_name.send_keys('Tsunami')

# Fill the family name
sign_up_family_name=wd.find_element(By.ID,'fam_name')
sign_up_family_name.send_keys('Ryu')

# Fill the gender
sign_up_gender=wd.find_element(By.ID,'gender')
select_gender=Select(sign_up_gender)
select_gender.select_by_index(1)

# Fill the city
sign_up_city=wd.find_element(By.ID,'city')
sign_up_city.send_keys('Linkoping')

# Fill the country
sign_up_country=wd.find_element(By.ID,'country')
sign_up_country.send_keys('Sweden')

# Fill the email
new_email=generate_random_email()
sign_up_email=wd.find_element(By.ID,'email')
sign_up_email.send_keys(new_email)

# Fill the password
sign_up_password=wd.find_element(By.ID,'psw')
sign_up_password.send_keys('11111111')

# Fill the password again
sign_up_repassword=wd.find_element(By.ID,'repsw')
sign_up_repassword.send_keys('22222222')


# Click the submit button
sign_up_button=wd.find_element(By.CSS_SELECTOR,'button.signup')
sign_up_button.click()

time.sleep(0.2)
# It should fail
try:
    sign_up_message=wd.find_element(By.CSS_SELECTOR,'.signup_message')
    raise ValueError('Signup with different password should fail,but it doesn\'t')
except:
    pass


time.sleep(2)

sign_up_repassword.clear()
sign_up_repassword.send_keys('11111111')

# Click the submit button again for the right password
sign_up_button.click()

time.sleep(0.3)
# It should success
try:
    sign_up_message=wd.find_element(By.CSS_SELECTOR,'.signup_message')
    print('Signup test successfully (1/12)')
except:
    raise ValueError('Signup with the same password should succeed,but it doesn\'t')

'''
Function 2:SignIn

Test the sign in function

'''
time.sleep(2)

# Fill the signin email
sign_in_email=wd.find_element(By.CSS_SELECTOR,'#email_signin')
sign_in_email.send_keys(new_email)

signin_in_password=wd.find_element(By.CSS_SELECTOR,'#psw_signin')
signin_in_password.send_keys("12345678")

sign_in_button=wd.find_element(By.CSS_SELECTOR,'button.signin')
sign_in_button.click()

time.sleep(0.3)
# It should fail if the password is not correct
try:
    login_fail_message=wd.find_element(By.CSS_SELECTOR,'.signin_fail_message')
except:
    raise ValueError('Signin with the wrong password should fail,but it doesn\'t')



time.sleep(2)

signin_in_password.clear()
signin_in_password.send_keys('11111111')

sign_in_button.click()

time.sleep(1)
profilepage=wd.find_element(By.CSS_SELECTOR,'#profilepage')
profilepage_style=profilepage.get_attribute('style')
display_value = ''
if 'display' in profilepage_style:
    style_parts = profilepage_style.split(';')
    for part in style_parts:
        if 'display' in part:
            display_value = part.split(':')[1].strip()
if(display_value=='block'):
    print('Signin test successfully (2/12)')
    pass
else:
    raise ValueError('Signin with the right password should success,but it doesn\'t')


'''
Function 3:Post message

Test the post message function

'''
time.sleep(2)

post_message=wd.find_element(By.CSS_SELECTOR,'#messageText')
post_email=wd.find_element(By.CSS_SELECTOR,'#postemail')
post_button=wd.find_element(By.CSS_SELECTOR,'#postBtn')

# Message shouldn't be blank
# Email should be right
post_email.send_keys('sdfgbn@dfgnm.com')
post_button.click()

time.sleep(0.2)
# Message shouldn't be blank
post_message_placeholder_value = post_message.get_attribute("placeholder")
if(post_message_placeholder_value=='Write something here!'):
    print('Blank message test pass!  (3/12)')
    pass
else:
    raise ValueError('post blank message should fail,but it doesn\'t')

time.sleep(2)

post_message.send_keys('The quick brown fox jumps over the lazy dog.')
post_button.click()

time.sleep(0.2)
# Email should be right
post_email_placeholder_value = post_email.get_attribute("placeholder")
if(post_email_placeholder_value=='Incorrect Email'):
    print('Send message to not exist user test pass!  (4/12)')
    pass
else:
    raise ValueError('posting message to users whom does not exist should fail,but it doesn\'t')


time.sleep(2)

post_email.clear()
post_email.send_keys(new_email)
post_button.click()

time.sleep(0.2)
#post message to myself with text and correct(mine) username should pass
posted_message=wd.find_element(By.CSS_SELECTOR,'div.textMessage p')
content=posted_message.get_attribute('innerText')
if(content=='The quick brown fox jumps over the lazy dog.'):
    print('Post message to oneself test has passed!  (5/12)')
    pass
else:
    raise ValueError('posting message to oneself which content and correct email should succeed,but it doesn\'t')

time.sleep(2)

#Send message to other
post_message.send_keys('The quick brown fox jumps over the lazy dog.')
post_email.send_keys('admin@admin.com')
post_button.click()

time.sleep(0.2)
if(post_email.get_attribute("placeholder")=='Incorrect Email' or post_message.get_attribute("placeholder")=='Write something here!'):
    raise ValueError('posting message to users whom exist with proper content should succeed,but it doesn\'t')
else:
    print('Post message to other user who exist test has passed! (6/12)')
    pass


'''
Function 4:Search another User

Test the search function

'''
time.sleep(2)

home_btn=wd.find_element(By.CSS_SELECTOR,'.homeButton')
browse_btn=wd.find_element(By.CSS_SELECTOR,'#browseButton')
account_btn=wd.find_element(By.CSS_SELECTOR,'.accountButton')

browse_btn.click()
browse_input=wd.find_element(By.CSS_SELECTOR,'#browseInput')
browse_button=wd.find_element(By.CSS_SELECTOR,'#browseBtn')

# The User should exist
browse_input.send_keys('redxcfgvhb@gtfyvhbj.com')
browse_button.click()

time.sleep(0.2)
#Search for user who doesn't exist should fail
browse_input_placeholder_value = browse_input.get_attribute("placeholder")
if(browse_input_placeholder_value=='User not exist!'):
    print('Search for user who does not exist test has passed! (7/12)')
    pass
else:
    raise ValueError('Search for users who does not exist should fail,but it doesn\'t')


time.sleep(2)

browse_input.send_keys('admin@admin.com')
browse_button.click()
time.sleep(0.5)

#Search for user who exist should succeed
browse_user=wd.find_element(By.CSS_SELECTOR,'#browseTab')
browse_user_style=browse_user.get_attribute('style')
display_value = ''
if 'display' in browse_user_style:
    style_parts = browse_user_style.split(';')
    for part in style_parts:
        if 'display' in part:
            display_value = part.split(':')[1].strip()
if(display_value=='block'):
    print('Search for User who exist test successfully. (8/12)')
    pass
else:
    raise ValueError('Search for User who exist should success,but it doesn\'t')

wd.execute_script("window.scrollTo(0, document.body.scrollHeight)")


'''
Function 5:Change password

Test the change password function

'''
time.sleep(2)

account_btn.click()
time.sleep(0.2)
wd.execute_script("window.scrollTo(0, document.body.scrollHeight)")
time.sleep(0.2)
change_psw_button=wd.find_element(By.CSS_SELECTOR,'.changepsw')
change_psw_button.click()
time.sleep(0.2)
wd.execute_script("window.scrollTo(0, document.body.scrollHeight)")
time.sleep(0.2)

current_psw=wd.find_element(By.CSS_SELECTOR,'#oldpsw')
new_psw=wd.find_element(By.CSS_SELECTOR,'#newpsw')
new_psw_confirm=wd.find_element(By.CSS_SELECTOR,'#newpswconfirm')

# New password and confirm should be the same

new_psw.send_keys('22222222')
new_psw_confirm.send_keys('22222221')
current_psw.send_keys('11111111')

change_psw_submit=wd.find_element(By.CSS_SELECTOR,'button.changebutton')
change_psw_submit.click()

time.sleep(0.5)
# New password and confirm should be the same
welcome_page=wd.find_element(By.CSS_SELECTOR,'#welcomepage')
welcome_page_style=welcome_page.get_attribute('style')
display_value = ''
if 'display' in welcome_page_style:
    style_parts = welcome_page_style.split(';')
    for part in style_parts:
        if 'display' in part:
            display_value = part.split(':')[1].strip()

if(display_value=='block'):
    raise ValueError('New password and confirm are not the same,change password should fail,but it doesn\'t')
else:
    print('Change password with different new password and confirm password test has passed! (9/12)')
    pass

wd.execute_script("window.scrollTo(0, document.body.scrollHeight)")


time.sleep(2)
new_psw_confirm.clear()
new_psw_confirm.send_keys('22222222')
change_psw_submit.click()

time.sleep(2)
# New password and confirm should be the same
welcome_page=wd.find_element(By.CSS_SELECTOR,'#welcomepage')
welcome_page_style=welcome_page.get_attribute('style')
display_value = ''
if 'display' in welcome_page_style:
    style_parts = welcome_page_style.split(';')
    for part in style_parts:
        if 'display' in part:
            display_value = part.split(':')[1].strip()

if(display_value=='none'):
    raise ValueError('New password and confirm are the same,change password should succeed,but it doesn\'t')
else:
    print('Change password with the same new password and confirm password test has passed! (10/12)')
    pass

wd.execute_script("window.scrollTo(0, document.body.scrollHeight)")


time.sleep(2)
# Try sign in with the old and new psw
sign_in_email=wd.find_element(By.CSS_SELECTOR,'#email_signin')
signin_in_password=wd.find_element(By.CSS_SELECTOR,'#psw_signin')
sign_in_button=wd.find_element(By.CSS_SELECTOR,'button.signin')


sign_in_email.send_keys(new_email)

signin_in_password=wd.find_element(By.CSS_SELECTOR,'#psw_signin')
signin_in_password.send_keys("11111111")

sign_in_button=wd.find_element(By.CSS_SELECTOR,'button.signin')
sign_in_button.click()

time.sleep(0.2)
# It should fail if the password is old
try:
    login_fail_message=wd.find_element(By.CSS_SELECTOR,'.signin_fail_message')
    print('Signin with the old password test has passed. (11/12)')
except:
    raise ValueError('Signin with the old password should fail,but it doesn\'t')

time.sleep(2)

signin_in_password.clear()
signin_in_password.send_keys('22222222')

sign_in_button.click()

time.sleep(3)
#Signin with the new password should succeed
profilepage=wd.find_element(By.CSS_SELECTOR,'#profilepage')
profilepage_style=profilepage.get_attribute('style')
display_value = ''
if 'display' in profilepage_style:
    style_parts = profilepage_style.split(';')
    for part in style_parts:
        if 'display' in part:
            display_value = part.split(':')[1].strip()


if(display_value=='block'):
    print('Signin with the new password test has passed! (12/12)')
    pass
else:
    raise ValueError('Signin with the new password should success,but it doesn\'t')

time.sleep(2)

print("Test have done")


#close the browser
# wd.quit()

#操纵元素
#element.click()    #会点击元素的正中心
#element.clear()    #清除元素（input）钟内容
#element.get_attribute('class') #获得元素的属性
#element.get_attribute('outerHTML') #获得元素的全部html内容
#element.get_attribute('innerHTML') #只获得内部的html内容
#element.get_attribute('value') #获得input框内的内容
#element.get_attribute('innerText') #获得元素内容（文本形式）












