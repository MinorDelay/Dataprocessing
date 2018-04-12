#!/usr/bin/env python
# Name: Simon Kemmere
# Student number: 10798250
"""
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
"""

import re
import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'


def extract_tvseries(dom):
    """
    Extract a list of highest rated TV series from DOM (of IMDB page).
    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # search all content within lister-item-content
    series_info = dom.find_all("div", class_="lister-item-content")

    # create empty list
    infolist = []

    # loop over each serie individually
    for info in series_info:

        # create empty list for appending
        series = []
        titles = info.h3.a.text

        # create failsafe if no title exists
        if not titles:
            titles = "-"
        else:
            titles

        # append title to list
        series.append(titles)

        # search rating in html
        rating = info.find("div", {"data-value":True})

        # create failsafe if no rating exists
        if not rating:
            rating = "-"
        else:
            rating

        # append rating to list
        series.append(rating["data-value"])

        # search genre in html
        genre = info.find("span", class_="genre")

        # create failsafe if no genre exists
        if not genre:
            genre = "-"
        else:
            genre = genre.text.strip()

        # append genre to list
        series.append(genre)

        # search actors in html
        series_actors = info.find_all(class_="", href=re.compile("name"))

        # create failsafe if no actor exists
        if not series_actors:
            series_actors = "-"
        else:
            temp_actor = []

            # loop over all actors in html
            for actors in series_actors:
                actors = actors.text
                temp_actor.append(actors)
                joined_actors = ", ".join(temp_actor)

        # append actors to list
        series.append(joined_actors)

        # search runtime of series in html
        runtime = info.find("span", class_="runtime")

        # create failsafe if no runtime exists
        if not runtime:
            runtime = "unknown"
        else:
            runtime = runtime.text.split(" ")[0]

        # append runtime to list
        series.append(runtime)

        # append list containing title, rating, genre, actors and runtime to list
        infolist.append(series)

    return infolist


def save_csv(outfile, tvseries):
    """
    Output a CSV file containing highest rated TV-series.
    """

    # write header in outfile
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Genre', 'Actors', 'Runtime'])

    # write each row with all information of a serie
    for serie in tvseries:
        writer.writerow(serie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, tvseries)
