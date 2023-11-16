import React, {useState} from 'react';
import {supabase} from '../../client';
import {Link, useNavigate} from 'react-router-dom';

const Login = ({setToken}) => { 
    let navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "", password: ""
    })

    console.log(formData);
    const handleChange = (e) =>{
        setFormData((prevData) => {
            return{
                ...prevData, [e.target.name] : e.target.value
            }
        })
    }

    const handleSubmit = async (e) =>{   
        e.preventDefault();
        try{
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
              }
            );

            if(error) throw error
            console.log(data);

            setToken(data);
            sessionStorage.setItem("token",JSON.stringify(data));
            sessionStorage.setItem('upvoted', []);
            navigate('/');
            location.reload();
        } catch (error) {
            alert(error.message);
        }

        console.log(JSON.parse(sessionStorage.getItem("token")).user.id);
        try{
            const{data, error} = await supabase
                .from('LOL Account Likes')
                .select('upvotedPosts')
                .eq('id', JSON.parse(sessionStorage.getItem("token")).user.id)
            if(error) throw error

            console.log(data);
        } catch {
            const{error} = await supabase
            .from('LOL Account Likes')
            .insert({
                id: JSON.parse(sessionStorage.getItem("token")).user.id,
                upvotedPosts: []
            })
            if(error) throw error
        }
    }
    return(
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder='Email'
                    //value={formData.email}
                    name='email'
                    onChange={handleChange}
                />
                <input
                    placeholder='password'
                    //value={formData.password}
                    name='password'
                    type='password'
                    onChange={handleChange}
                />
                <button type='submit'>Submit</button>
            </form>
            Don't have an account? <Link to="/signup">Sign Up</Link>
        </div>
    )
}

export default Login;