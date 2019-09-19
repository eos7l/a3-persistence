Personal Shopping Assistant
===
http://a3-eos7l.glitch.me

This is a proof-of-concept shopping assistance web application that help consumers to find the best deals and best retailer to purchase with. 

To fulfill the requirements:
---
### Five Express Packages:
- Body-parser: parse the information sent inside the json object. 
- Passport-local: use for authentication. 
- Cookie-parser:  Parse cookie header and populate req.cookies.
- Server-static: serves the static files inside my public folder. 
- Helmet: Secures the app by setting various HTTP headers.
- Session: Establish server-based sessions.

### Authentication Strategy & Database: 

- I used passport for authentication and lowDB as my database storage. 

### HTML:

- I have a total of 5 different HTML pages. 

### CSS Framework:

- I used the framework found on templeMag. The original template can be found here: https://templatemag.com/demo/Mineem/
- I chose it because I love its simplistic style with the white background. 


Goals:
---
- This application serves as a proof-of-concept personal shopping assistant to make the shopping experience smoother and wishlist items more organized. 
- It allows users to add items which they want to monitor the price of. In the ideal world, the user will be able to receive updates once the price of the wishlist item is dropped. This is meant for only the currently logged-in user to see. 
- Ideally, it should also allow users to post deals/discounts/unused coupons whenever they find one online. The deals should be auto-generated to be posted on the main page and can be seen by all including guest users. 


Main Challenges:
---
- Since I have multiple HTML pages, storing the current user's information took me a while to figure out. I tried both local storage and document.cookie and it seems like the local storage method is more staple. 
- There were actually more documentation online for how to do Mongo and I feel like I should have used Mongo, particularly many answers could be found online for passport-Mongo. Professor and Kit Zeller helped me make it work though!
- For some reason the "required" attribute does not work for my form even though I made sure to declare my button type as "submit" inside the form. I checked some online comments and it seems like once I have implemented my own "submit" function I can no longer use HTML5's built in "require". Due to time constraint, I decide to keep things as they are. But if I were to continue this project, I would implement more error-checking functions. 
- Ideally I would like to implement another form so users can submit deals for guest users to see on the main page. Now I just hard coded everything to illustrate the idea.
- Ideally the user should be able to select the category of the wishlist items and the table will be adjusted correspondingly, but I don't have enough time to finish that.



Implications:
---
- Due to the difference in screen size, the page might look different. I suggest using a larger screen for optimal view. 


Achievements:
---
This is entirely different from what I built for A2 so none of the achievements are repeats from last name. 
### Technical:
- Implemented logout (can be found in the pushdown menu inside the account tab).
- You can sign up for an account.
    - I have pre-created an account that has the username "admin" and passsword "CS4241" for you to see some dummy values I used to initialize the dataset.
- Implemented registration that does not allow duplicate accounts. 
- Only displays data of currently logged-in user. 
- Used more than 5 express packages. 


    


### Design:
- Used the Type.js library for aesthetics. 
- Hard coded all the main.HTML and deals.HTML layout. These pages are mostly responsive. Try hovering and clicking!
- Learned how to make right-aligned items in the list using the attribute direction. In fact, learned a lot of CSS styling tricks and debug tricks. 
- The original CSS template is not meant to be used for any business so I made a lot of changes to the page in order to fit the content well. The original CSS framework is also a huge one that includes way too many things and it was not easy to turn it into what I have now. Check the link of the original template above for more context. 
- I designed the login and signup page from scratch while maintaining the style consistent with all other pages.  
- Hard coded the table and made the form hidden when table is created. 
- There are 5 HTML pages in total, feel free to use the navigation pane on the right to play around each. 
- Implemented a dropdown menu and self-fill field in the form. The entire form design is created from scratch. 

    


