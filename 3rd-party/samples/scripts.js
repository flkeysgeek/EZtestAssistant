EZ.tester.scripts = [
  {
    "id": 1448208108221,
    "name": "created 11-22 11:01 am",
    "status": 0,
    "testFields": [
      {
        "id": "list_str",
        "type": "checked",
        "value": false
      },
      {
        "id": "list_obj",
        "type": "checked",
        "value": true
      },
      {
        "id": "list_obj_huge",
        "type": "checked",
        "value": false
      },
      {
        "id": "list_regex",
        "type": "checked",
        "value": false
      },
      {
        "id": "listLength",
        "type": "value",
        "value": "23"
      },
      {
        "id": "resultsHeight",
        "type": "value",
        "value": "400"
      },
      {
        "id": "searchTextObj",
        "type": "value",
        "value": "dav"
      },
      {
        "id": "fuzzy_shouldSort",
        "type": "innerHTML",
        "value": "\n        <option value=\"false\">no sort</option>\n        <option value=\"true\" selected=\"\">by score</option>\n        <option value=\"value\">by value</option>\n        <option value=\"id\">by ids</option>\n        <option value=\"keys\">by keys</option>\n      "
      },
      {
        "id": "fuzzy_caseSensitive",
        "type": "checked",
        "value": false
      },
      {
        "id": "fuzzy_searchTime",
        "type": "checked",
        "value": true
      },
      {
        "id": "fuzzy_callback",
        "type": "checked",
        "value": false
      },
      {
        "id": "fuzzy_cancelTime",
        "type": "value",
        "value": "1000"
      },
      {
        "id": "fuzzy_pauseTime",
        "type": "value",
        "value": "500"
      },
      {
        "id": "fuzzy_location",
        "type": "value",
        "value": ""
      },
      {
        "id": "fuzzy_distance",
        "type": "value",
        "value": "55"
      },
      {
        "id": "fuzzy_threshold",
        "type": "value",
        "value": "0.4"
      },
      {
        "id": "fuzzy_maxPatternLength",
        "type": "value",
        "value": "32"
      },
      {
        "id": "fuzzy_truncateSearchText",
        "type": "checked",
        "value": true
      },
      {
        "id": "fuzzy_score",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\">separate array</option>\n          <option value=\"item array\" selected=\"\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_scoredKey",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\" selected=\"\">separate array</option>\n          <option value=\"item array\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_listIndex",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\">separate array</option>\n          <option value=\"item array\" selected=\"\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_matchedKeys",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\">separate array</option>\n          <option value=\"item array\" selected=\"\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_offsets",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\">separate array</option>\n          <option value=\"item array\" selected=\"\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_locations",
        "type": "innerHTML",
        "value": "\n          <option value=\"none\" selected=\"\">not included</option>\n          <option value=\"item\">item property</option>\n          <option value=\"array\">separate array</option>\n          <option value=\"item array\">item and array</option>\n        "
      },
      {
        "id": "fuzzy_maxResults",
        "type": "value",
        "value": ""
      },
      {
        "id": "fuzzy_formattedResults",
        "type": "innerHTML",
        "value": "\n        <option value=\"none\">none</option>\n        <option value=\"resultsTop\" selected=\"\">above</option>\n        <option value=\"resultsBottom\">below</option>\n      "
      },
      {
        "id": "fuzzy_itemIndex",
        "type": "checked",
        "value": true
      },
      {
        "id": "fuzzy_itemValue",
        "type": "checked",
        "value": false
      },
      {
        "id": "fuzzy_keys",
        "type": "value",
        "value": "title, author.firstName"
      },
      {
        "id": "fuzzy_sortKeys",
        "type": "value",
        "value": "author.firstName,title"
      },
      {
        "id": "fuzzy_id",
        "type": "value",
        "value": "title, author.firstName"
      }
    ],
    "testObjects": {},
    "lastResults": [
      {
        "item": {
          "title": "The DaVinci Code",
          "author": {
            "firstName": "Dan"
          }
        },
        "score": 0.07272727272727272,
        "matchedKeys": [
          "title",
          "author.firstName"
        ],
        "offsets": {
          "title": [
            4,
            7
          ],
          "author.firstName": [
            0,
            6
          ]
        }
      },
      {
        "item": {
          "title": "The Book of Samson",
          "author": {
            "firstName": "David"
          }
        },
        "score": 0,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            3
          ]
        }
      },
      {
        "item": {
          "title": "Angels & Demons",
          "author": {
            "firstName": "Dan"
          }
        },
        "score": 0.3333333333333333,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            6
          ]
        }
      },
      {
        "item": {
          "title": "The Lost Symbol",
          "author": {
            "firstName": "Dan"
          }
        },
        "score": 0.3333333333333333,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            6
          ]
        }
      },
      {
        "item": {
          "title": "The Preservationist",
          "author": {
            "firstName": "David"
          }
        },
        "score": 0,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            3
          ]
        }
      },
      {
        "item": {
          "title": "Fallen",
          "author": {
            "firstName": "David"
          }
        },
        "score": 0,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            3
          ]
        }
      },
      {
        "item": {
          "title": "Monster 1959",
          "author": {
            "firstName": "David"
          }
        },
        "score": 0,
        "matchedKeys": [
          "author.firstName"
        ],
        "offsets": {
          "author.firstName": [
            0,
            3
          ]
        }
      }
    ],
    "passResults": null,
    "lastRunTime": 1448208108221,
    "lastPassTime": "",
    "tetsObjects": {}
  }
];
EZ.tester.uploadDone();