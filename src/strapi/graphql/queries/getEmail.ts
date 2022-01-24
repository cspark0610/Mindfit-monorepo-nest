export const GetEmail = `
  query getEmail($key: String!, $locale: I18NLocaleCode!){
    emails(locale:$locale, filters:{
      key:{
        eq:$key
      }
    }){
      data{
        attributes{
          logo{
            data{
              attributes{
                url
              }
            }
          }
          banner{
            data{
              attributes{
                url
              }
            }
          }
          button{
            label
            href
          }
          title
          body
        }
      }
    }
  }
`;
