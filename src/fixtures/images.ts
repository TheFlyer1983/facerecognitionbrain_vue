import { Box } from '@/store/image/imageTypes';

export const boxesMock: Array<Box> = [
  {
    id: 'dafbdf2d6c0cdcd5f958aa84221a2018',
    region_info: {
      bounding_box: {
        top_row: 0.14814961,
        left_col: 0.210852,
        bottom_row: 0.9100416,
        right_col: 0.75433874
      }
    },
    data: {
      concepts: [
        {
          id: 'ai_8jtPl3Xj',
          name: 'face',
          value: 0.99997437,
          app_id: 'main'
        }
      ]
    },
    value: 0.99997437
  }
];

export const facesResponseMock = {
  status: {
    code: 10000,
    description: 'Ok',
    req_id: '02352f7105da8db10e4ea87b1b66fa5a'
  },
  outputs: [
    {
      id: 'f7c1644b531847b180ca1e4a91256097',
      status: {
        code: 10000,
        description: 'Ok'
      },
      created_at: '2022-10-27T12:46:46.282126681Z',
      model: {
        id: 'face-detection',
        name: 'Face',
        created_at: '2020-11-25T16:50:24.453038Z',
        modified_at: '2022-10-11T17:30:18.021257Z',
        app_id: 'main',
        output_info: {
          output_config: {
            concepts_mutually_exclusive: false,
            closed_environment: false,
            max_concepts: 0,
            min_value: 0
          },
          message: 'Show output_info with: GET /models/{model_id}/output_info',
          fields_map: {
            'regions[...].data.concepts[...].id': 'predicted_det_labels',
            'regions[...].data.concepts[...].value': 'predicted_det_scores',
            'regions[...].region_info.bounding_box': 'predicted_det_bboxes'
          },
          params: {
            detection_threshold: 0.5
          }
        },
        model_version: {
          id: '6dc7e46bc9124c5c8824be4822abe105',
          created_at: '2021-03-04T17:40:26.081729Z',
          status: {
            code: 21100,
            description: 'Model is trained and ready'
          },
          visibility: {
            gettable: 50
          },
          app_id: 'main',
          user_id: 'clarifai',
          metadata: {}
        },
        user_id: 'clarifai',
        input_info: {
          fields_map: {
            image: 'images'
          }
        },
        train_info: {},
        model_type_id: 'visual-detector',
        visibility: {
          gettable: 50
        },
        metadata: null,
        presets: {
          outputs: [
            {
              data: {
                regions: [
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9827497
                        }
                      ]
                    },
                    id: 'da91443082a8d56c6afe96d5dec9d75e',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.4601788,
                        left_col: 0.6742708,
                        right_col: 0.7372631,
                        top_row: 0.32203546
                      }
                    },
                    value: 0.9827497
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.94050133
                        }
                      ]
                    },
                    id: '1c25a94f6ce1ddba0142ed3d9ea52c5d',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.46288866,
                        left_col: 0.15568428,
                        right_col: 0.21419635,
                        top_row: 0.32342058
                      }
                    },
                    value: 0.94050133
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.93389475
                        }
                      ]
                    },
                    id: 'e495dbc30a629a5da933acfc7ab15d8d',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.65176886,
                        left_col: 0.5574365,
                        right_col: 0.649708,
                        top_row: 0.46757302
                      }
                    },
                    value: 0.93389475
                  }
                ]
              },
              input: {
                data: {
                  image: {
                    url: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-crowd-at-concert.jpg'
                  }
                },
                id: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-crowd-at-concert.jpg'
              }
            },
            {
              data: {
                regions: [
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.99995315
                        }
                      ]
                    },
                    id: '9d621c552ddcfbaeeae69f750570cc2e',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.48096794,
                        left_col: 0.21118721,
                        right_col: 0.30718452,
                        top_row: 0.30835658
                      }
                    },
                    value: 0.99995315
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9998921
                        }
                      ]
                    },
                    id: '5e25698486560eb1520d27e80c32bdda',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.5988715,
                        left_col: 0.7787644,
                        right_col: 0.8526587,
                        top_row: 0.41961926
                      }
                    },
                    value: 0.9998921
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9993899
                        }
                      ]
                    },
                    id: '0ae565b80228cf4a88ca82193c288640',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.3629434,
                        left_col: 0.68104047,
                        right_col: 0.7450674,
                        top_row: 0.21791123
                      }
                    },
                    value: 0.9993899
                  }
                ]
              },
              input: {
                data: {
                  image: {
                    url: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-three-men-sitting-in-van.jpg'
                  }
                },
                id: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-three-men-sitting-in-van.jpg'
              }
            },
            {
              data: {
                regions: [
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9994325
                        }
                      ]
                    },
                    id: '98ddb334eb3fe8aad9f329cfbc3c7d58',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.2838029,
                        left_col: 0.5915262,
                        right_col: 0.65852743,
                        top_row: 0.1531644
                      }
                    },
                    value: 0.9994325
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9982388
                        }
                      ]
                    },
                    id: '5d0fb4f568a1f2fa96756ac752070ca5',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.26873106,
                        left_col: 0.36944836,
                        right_col: 0.43719745,
                        top_row: 0.13264115
                      }
                    },
                    value: 0.9982388
                  }
                ]
              },
              input: {
                data: {
                  image: {
                    url: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-little-girl-boy-standing-outside.jpg'
                  }
                },
                id: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-little-girl-boy-standing-outside.jpg'
              }
            },
            {
              data: {
                regions: [
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9981242
                        }
                      ]
                    },
                    id: 'bdd084429be6168e852b1048749b0ff5',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.5628798,
                        left_col: 0.6091833,
                        right_col: 0.7235174,
                        top_row: 0.47290653
                      }
                    },
                    value: 0.9981242
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9966601
                        }
                      ]
                    },
                    id: '02a3a6f78289589f8151b1e39206ff5b',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.6073031,
                        left_col: 0.20170988,
                        right_col: 0.32489952,
                        top_row: 0.5048867
                      }
                    },
                    value: 0.9966601
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9747561
                        }
                      ]
                    },
                    id: 'c6b83bf167fd2f81fb9d39ce9d6807da',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.26765388,
                        left_col: 0.2506745,
                        right_col: 0.36780778,
                        top_row: 0.15117697
                      }
                    },
                    value: 0.9747561
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.96262014
                        }
                      ]
                    },
                    id: '87634ab470f363f86d3d27d0e898b673',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.22550206,
                        left_col: 0.58755136,
                        right_col: 0.7235628,
                        top_row: 0.07170115
                      }
                    },
                    value: 0.96262014
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.92971206
                        }
                      ]
                    },
                    id: '8c9f6153c14b035702723943cc43ee73',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.5287504,
                        left_col: 0.4105998,
                        right_col: 0.52681744,
                        top_row: 0.41924834
                      }
                    },
                    value: 0.92971206
                  }
                ]
              },
              input: {
                data: {
                  image: {
                    url: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-family-with-light-blue-shirts.jpg'
                  }
                },
                id: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-family-with-light-blue-shirts.jpg'
              }
            },
            {
              data: {
                regions: [
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.9999788
                        }
                      ]
                    },
                    id: 'da88c036b88ddc8a7c9f48e2b6ede2ab',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.46289057,
                        left_col: 0.5528432,
                        right_col: 0.75457734,
                        top_row: 0.078548975
                      }
                    },
                    value: 0.9999788
                  },
                  {
                    data: {
                      concepts: [
                        {
                          app_id: 'main',
                          id: 'ai_b1b1b1b1',
                          name: 'BINARY_POSITIVE',
                          value: 0.99993014
                        }
                      ]
                    },
                    id: 'c1c9b3a7b4f45806ba176942ffb5c3ea',
                    region_info: {
                      bounding_box: {
                        bottom_row: 0.72138995,
                        left_col: 0.7510626,
                        right_col: 0.98028976,
                        top_row: 0.25813732
                      }
                    },
                    value: 0.99993014
                  }
                ]
              },
              input: {
                data: {
                  image: {
                    url: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-arfrican-american-man-woman-laughing.jpg'
                  }
                },
                id: 'https://s3.amazonaws.com/samples.clarifai.com/featured-models/face-arfrican-american-man-woman-laughing.jpg'
              }
            }
          ]
        },
        languages: [],
        import_info: {},
        workflow_recommended: false
      },
      input: {
        id: 'aba42714dd394f54b0d336d1114f529a',
        data: {
          image: {
            url: 'https://images.newscientist.com/wp-content/uploads/2022/02/14174128/PRI_223554170.jpg?crop=4:3,smart&width=1200&height=900&upscale=true'
          }
        }
      },
      data: {
        regions: boxesMock
      }
    }
  ]
};
