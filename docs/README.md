# Documentation

## Pi Download Location

When the user selects the `Pi` option when downloading a `.csv` file of the database, this app will not send it to the user, instead writing the file to the Pi itself. This can be changed in the `app.routes/base.py` file by editing the `PI_DOWNLOAD_LOCATION` constant. Currently it is set to download in the `docs` directory of this app.

----

## Config.json
There is a `config.json` located in the root directory of this app. It contains four values:

* `itemsPerPage`: The number of items that will be loaded on each pagination in the table.
* `itemName`: The name of the objects displayed to the user. For example, the item input will contain the placeholder `Item Code` if this is set to `Item` or `Object Code` if set to `Object`.
* `buttonsName`: Similar to the last value, this will simply set what the type buttons represent. It will change the text above the buttons and in the table header.
* `itemCodeLength`: The number of characters allowed for the object code.

----

## Adding More Type buttons

The type buttons can be edited by opening `app/webpack/form/ItemForm.tsx`. A constant `typeButtonProps` defines these buttons using a list of objects, each containing a `display` (the text displayed to the user) and an `eventCode` (the eventCode of the key, when pressed, adds an item of this type). EventCodes can be found using https://keycode.info/.

----

## Editing Locations

Locations can be edited either with the in-browser form, or uploading a JSON. Locations are in the format `code: name` where `code` is the value stored in the database and `name` is the text displayed in the HTML location select form. An example of the correct format is located in this folder.

----

## Updating

To update via this repository, first clone it to your computer. To run a local development server, make sure you have both python and npm/node installed. Run the `venv/bin/activate` script to enter the virtual environment before running `flask run` to startup the backend server. In another terminal, run `npm run dev` to start the node server. After committing your changes, add the Pi as a remote address on your computer by connecting the Pi to your network (using `raspi-config` for WiFi) and running `git remote add pi git@<PI'S_IP_ADDRESS>:/home/git/piserver.git` and push to it using `git push pi master`. The pi is currently set up to have a static IP of `192.168.4.1`.

Additionally, you can manually edit the production files by opening a connection with `ssh pi@<PI's_IP_ADDRESS>` with password `password`. The app is stored in the `var/www/piserver` directory. **WARNING**: Any changes made to the production files will be overridden if new changes are pushed from a development repository in the future.

----

**NOTE**: After making any changes (either through editing the production files or pushing from a development repo), restarting the uwsgi server using `sudo systemctl restart piserver.service` and rebuilding the webpack files using `npm run build` from the `/var/www/piserver` directory will usually be needed.
