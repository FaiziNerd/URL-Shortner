const sessionIdToUserMap = new Map()

function setUser (id, user)
{
    sessionIdToUserMap.set(id,user)
}



function getUser()
{
    return sessionIdToUserMap.get(id)
}



module.exports =
{
    setUser,
    getUser
};