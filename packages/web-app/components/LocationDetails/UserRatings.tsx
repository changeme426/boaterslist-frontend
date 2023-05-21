import { Locations } from 'common/models/Locations';
import theme from 'common/theme';
import { FaUserCircle } from "react-icons/fa";
// import { Text, View, StyleSheet } from 'react-native'

interface PropTypes {
    location: Locations
}

export function UserRatings({ location }: PropTypes) {

    const userRating = [{
        userName: 'User 1',
        date: 'Jul 20, 2021',
        comment: 'Amazing service'
    },
    {
        userName: 'User 2',
        date: 'Sep 2, 2021',
        comment: 'Great service'
    },
    {
        userName: 'User 3',
        date: 'Jan 24, 2021',
        comment: 'Amazing service'
    },
    {
        userName: 'User 4',
        date: 'Sep 4 20, 2021',
        comment: 'Great service'
    },
    {
        userName: 'User 5',
        date: 'Dec 8, 2021',
        comment: 'Amazing service'
    }]

    // const Divider = () => {
    //     return <div style={{borderBottomColor: `${theme.colors.brandLightGray}`, borderBottomWidth: 1}}></div>
    // }
    return (
        <div>
            <hr />
            {userRating.map((user: any, idx: number) =>
                <div key={idx}>
                    <div className="dataContainer">
                        <div className="userImage">
                            <FaUserCircle style={{fontSize: 50, color: `${theme.colors.brandGray}`}} />
                        </div>
                        <div className="userData">
                            <div><div className={"user"}>{user.userName}</div></div>
                            <div ><div className={"date"}>{user.date}</div></div>
                            <div><div className={"user"}>{user.comment}</div></div>
                        </div>
                    </div>
                    <hr />
                </div>)}

            <style jsx>{`
                .dataContainer{
                    display:flex;
                }
                .userImage{
                    display:flex;
                    align-items: center;
                    margin-right: 10px;
                }
                .user, .date{
                    font-size: 16px;
                }
                .date{
                    color: ${theme.colors.brandGray};
                }
                hr{
                    border-color: ${theme.colors.brandLightGray};
                }
            `}</style>
        </div>
    )
}

// const styles = StyleSheet.create({
//     user: {
//         color: `${theme.colors.brandBlack}`,
//         fontSize: 16
//     },
//     date:{
//         color: `${theme.colors.brandGray}`,
//         fontSize: 16
//     }
//   });
