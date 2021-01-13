# Scriptable Shopping List

This collection of scripts is meant to be run in the [Scriptable](https://scriptable.app/) app for iOS. It presents you with your favorite recipes and uses your selection to create a list of required ingredients as a checklist inside an [Agenda](https://agenda.com/) project. It fetches the recipe data from a [Contentful](https://www.contentful.com/) space.

<img src="./assets/shopping-list.gif" style="width: 50%; min-width: 200px;">

[Click here for a short demo video.](https://twitter.com/mgschoen/status/1349435919208747015)

## Prerequisites

* Install [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) on your iPhone/iPad
* Install [Agenda](https://apps.apple.com/app/agenda/id1370289240) on the same device, create an account and sign in
* Create a [Contentful](https://www.contentful.com/) account

## Prepare the database

In contentful, create a space with two collections: `recipes` and `ingredients`.

The `ingredients` collection only needs to have a plain text `title` field. An example ingredient entry looks like this:

```json
{
    "title": "Aubergines"
}
```

The `recipes` collection needs to have two fields:

* `title` for storing the recipe's name (plain text)
* `ingredients` for storing references to ingredients and the associated amount. Use the "JSON object" field type for this. Use the [contentful-ingredients-field-app](https://github.com/mgschoen/contentful-ingredients-field-app) extension, if you want a nicer UI than just a JSON editor.

An example recipe entry looks like this:

```json
{
    "title": "Mac 'n' Cheese",
    "ingredients": [
        {
            "amount": "200 g",
            "id": "<ingredient-id>"
        },
        {
            "amount": "500 ml",
            "id": "<ingredient-id>"
        }
    ]
}
```

## Prepare the script

Copy the contents of this repo into your Scriptable folder. Usually this is the `/Scriptable/` folder in your iCloud Drive. Make sure to not miss the `./recipe-shopping-list/` subfolder from this repo. 

Open [`Shopping List.js`](./blob/master/Shopping\ List.js) and replace lines 20 and 21 with your Contentful credentials:

```js
19  const contentful = new ContentfulClient({
20      accessToken: '<your-contentful-access-token-here>',
21      spaceId: '<your-contentful-spaceid-here>',
22      environment: 'master'
23  });
```

Make sure all files are synced to the device your running Scriptable and Agenda on.

You should now see a script called "Shopping List" in your Scriptable app. Run it and enjoy never having to write shopping lists again ;)

## Feedback

Feel free to drop me a line via [email](mailto:ich@madaman.de) or [Twitter](https://twitter.com/mgschoen).