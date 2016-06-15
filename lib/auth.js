

var auth = {
	authenticate : function(role){
		return function(req, res, next){
			if(!req.session.user){
				req.flash('info', 'Xin Vui Lòng Đăng Nhập Vào Hệ Thống.');
				res.redirect('/login');
				return;
			}

			if(role && req.session.user.Role.Type != role){
				req.flash('info', 'Bạn Không Có Quyền Truy Cập Vào Trang Này.');
				res.redirect('/login');
				return;
			}
			next();
		}
	}
};
module.exports = auth;