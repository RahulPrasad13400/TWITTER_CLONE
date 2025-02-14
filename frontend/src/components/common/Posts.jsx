import Post from "./Post";
import {useQuery} from "@tanstack/react-query"
import PostSkeleton from "../skeletons/PostSkeleton";
import { useEffect } from "react";
// import { POSTS } from "../../utils/db/dummy";


const Posts = ({feedType, username, userId}) => {
	// const isLoading = false;

	const getPostEndPoint = () =>{
		switch(feedType){
			case "forYou": // all posts 
				return "/api/posts/all"
			case "following":	// posts of the following user 
				return "/api/posts/following"
			case "posts":     // posts of the selected user 
				return `/api/posts/user/${username}`
			case "likes":	// posts liked by the selected user 
				return `/api/posts/likes/${userId}`
			default:
				return "/api/posts/all"
		}
	}

	const POST_ENDPOINT = getPostEndPoint()

	const { data : posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey : ["posts"],
		queryFn : async () =>{
			try{
				const res = await fetch(POST_ENDPOINT)
				const data = await res.json() 
				if(!res.ok){
					throw new Error(data.error || "Something went wrong")
				}
				return data 
			}catch(error){
				throw new Error(error)
			}
		}
	})

	useEffect(function(){
		refetch()
	},[feedType, refetch, username])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;